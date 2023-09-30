
const jwt = require('jsonwebtoken');
const Users = require('../models/User');

const userAuthorized = (req, res, next) => {
    // Get the user from the jwt token..
    const token = req.header('auth-token');
    if(!token){
        res.status(401).json({message: "Please authenticate using the valid token"});
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(data)
        // const te = await Users.findOne(data.id);
        // console.log(te)
        
        req.owner = data.id;
        next(); 
    } catch (error) {
        res.status(500).json({message: "Please authenticate using the valid token"});
    }
}

module.exports = userAuthorized;