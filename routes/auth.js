const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/User.js");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// ROUTE1 : Register the user using POST: "/api/auth/register"

router.post(
  "/register",
  [ body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid Email Format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage(`The Password's Length must be greater than 6`),
  ],
  async (req, res) => {
    const { name, email, password, contactNumber } = req.body;

    const errors = validationResult(req);

    // If there are bad requests, return the bad request and the error in json.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user_Registered = await Users.findOne({ email });

      if (user_Registered) {
        return res
          .status(400)
          .json({ status: "Failed", message: "User is already registered." });
      }

      const salt = await bcrypt.genSalt(10);
      const sec_password = await bcrypt.hash(password, salt);
      // Create a new User..
      const newUser = await Users.create({
        name,
        email,
        password: sec_password,
        contactNumber,
      });
      //   console.log(newUser);

      const authtoken = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET_KEY
      );
      //   console.log(authtoken);
        newUser.password = undefined;
      res.json({ authtoken: authtoken, newUser });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "Failed", message: `INTERNAL SERVER ERROR: ${error}` });
    }
  }
);

// ROUTE 2: Authenticate a user using POST: "/api/auth/login". Does not require auth.

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email Format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage(`The Password's Length must be greater than 6`),
  ],
  async (req, res) => {

    const errors = validationResult(req);

    // If there are bad requests, return the bad request and the error in json.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    
    try {
      //Check whether the email is registered or not.
      const user = await Users.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({
            status: "Failed",
            message: "Please try to login with the correct credentials",
          });
      }
      //Compare the passwords with the input password to the dB stored password.
      const passwordCompare = await bcrypt.compare(password, user.password);

      //If the password is wrong, then return the failed response.
      if (!passwordCompare) {
        return res
          .status(400)
          .json({
            status: "Failed",
            error: "Please try to login with the correct credentials",
          });
      }
      // Generate the token with the id of the existing owner.
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      console.log(user);

      // Destructuring the password from the response.
      const { password: hashedPassword, ...rest } = user._doc;

      res
        .cookie("access-token", token, { httpOnly: true })
        .status(200)
        .send(rest);
    } catch (error) {
      return res
        .status(500)
        .json({ status: "Failed", message: `INTERNAL SERVER ERROR: ${error}` });
    }
  }
);

module.exports = router;
