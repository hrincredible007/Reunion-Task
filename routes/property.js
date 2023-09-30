const express = require('express');
const userAuthorized = require('../middleware/userAuthorized');
const { body, validationResult } = require("express-validator");
const Property = require('../models/Property.js');


const router = express.Router();


//Route 0: List all the properties in the database No auth required.. =>GET: "/api/property/all"

router.get('/all', async(req, res) => {
    try {
        const property_Data = await Property.find();
        console.log(property_Data);
        res.json(property_Data);
        
    } catch (error) {
        
    }
});


// Route 1: List the owner's property => GET: "/api/property/list"
router.get("/list",  userAuthorized, async(req, res) => {
    try {
        // Fetch all the properties of a particular user.
        const notes = await Property.find({ owner: req.owner });
        res.json(notes);
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
});


//Route 2: Add the owner's property => POST: "/api/property/add"
router.post("/add", userAuthorized,[
    body("name").notEmpty().withMessage("Name of the property is required"),
    body("rent").notEmpty().withMessage("Rent of the property is required"),
    body("location").notEmpty().withMessage("Location of the Property is required."),
    body("beds").notEmpty().withMessage("Name of beds of the property is required"),
    body("bathroom").notEmpty().withMessage("Number of bathrooms of the property is required"),
    body("area").notEmpty().withMessage("Area of the Property is required."),
], async(req, res) => {

    // Destructuring the request of the Route.
    const {name, rent, location, beds, bathroom, area} = req.body;

    //If there are errors, return the failed response with message.
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({status: "Failed", errors: errors.array()});
    }

    try {
        // Creating the new property..
        const newProperty = new Property({
            name, rent, location, beds, bathroom, area, owner: req.owner
        });

        // console.log(req.owner);
        //Saving the new Property into the collection.
        const savedProperty = await newProperty.save();
        
        return res.status(200).json(savedProperty);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: "Failed", message: "INTERNAL SERVER ERROR:", error: error});
    }

});

//Route 3: Update the owner's property => PUT: "/api/property/update/:id"

router.put('/update/:id', userAuthorized, [
    // body("name").notEmpty().withMessage("Name of the property is required"),
    // body("rent").notEmpty().withMessage("Rent of the property is required"),
    // body("location").notEmpty().withMessage("Location of the Property is required."),
    // body("beds").notEmpty().withMessage("Name of beds of the property is required"),
    // body("bathroom").notEmpty().withMessage("Number of bathrooms of the property is required"),
    // body("area").notEmpty().withMessage("Area of the Property is required."),
], async(req, res) => {

     // Destructuring the request of the Route.
     const {name, rent, location, beds, bathroom, area} = req.body;

     // If there are errors, return the failed response with message.
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({status: "Failed", errors: errors.array()});
    };

    if(!name && !rent && !location && !beds && !bathroom && !area){
        return res.status(404).json({
            status: "Failed",
            message: "Please enter the enity to be updated"
        });
    }

    try {
        const newProperty = {};
        if(name){
            newProperty.name = name;
        }
        if(rent){
            newProperty.rent = rent;
        }
        if(location){
            newProperty.name = location;
        }
        if(beds){
            newProperty.rent = beds;
        }
        if(bathroom){
            newProperty.name = bathroom;
        }
        if(area){
            newProperty.rent = area;
        }

        // Find the property to be updated.
        // If that property is not present.
        console.log(req.params.id)
        
        let propertyCheck = await Property.findById(req.params.id);

        // If the property to be updated does not exist then return the failed response with message.
        console.log(propertyCheck)
        
        if(!propertyCheck){
            return res.status(401).json({status: "Failed" , message: 'User with this id does not exists'});
        }

        // Checking whether the user is trying to update his property details only or not.
        console.log(propertyCheck);

        console.log(req.owner);
        console.log(propertyCheck.owner.valueOf())
        
        if(propertyCheck.owner.valueOf().toString() !== req.owner){
            return res.status(401).send({status: "FAILED", message :'Not Allowed'});
        }
        
        propertyCheck = await Property.findByIdAndUpdate(req.params.id, { $set: newProperty }, { new: true });
        
        res.status(200).json({status: "Success", updatedProperty: propertyCheck})


    } catch (error) {
        console.log(error);
        return res.status(500).json({status: "Failed", message: "INTERNAL SERVER ERROR:", error: error});
    }


});


//Route 4: Delete the owner's property => DELETE: "/api/property/delete/:id"

router.delete('/delete/:id', userAuthorized, async(req, res) => {   
    console.log("thiss")

    try {
        // Find the property to be deleted..
        let property_toBE_Deleted = await Property.findById(req.params.id);
        
        console.log("thiss")
        // If the property with the passed ID is not present.
        if(!property_toBE_Deleted){
            return res.status(401).json({ status: "FAILED", error: "Property does not exists" });
        }
        
        //Checking If the user is deleting his property only..

        if(property_toBE_Deleted.owner.valueOf().toString() !== req.owner){
            return res.status(401).send({status: "FAILED", message :'Not Allowed'});
        } 

        // Now Delete the existing property record..
        
        property_toBE_Deleted = await Property.findByIdAndDelete(req.params.id);

        res.json({success: "The Property has been deleted", Deleted_Property: property_toBE_Deleted});
        
    } catch (error) {
        
    }
});

module.exports = router;