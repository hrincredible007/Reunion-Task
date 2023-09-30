const mongoose = require("mongoose");

const propertyModel = mongoose.Schema(
  {
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    name: {
      type: String,
      required: [true, "The name of the property is required."],
    },
    rent: {
      type: String,
      required: [true, "The rent of the property is required."],
    },
    location: {
      type: String,
      required: [true, "The location of the property is required."],
    },
    beds: {
        type: Number,
        required: [true, "The number of beds cannot be empty."]
    },
    bathroom: {
        type: Number,
        required: [true, "The number of bathrooms cannot be empty."]
    },
    area: {
        type: String,
        required: [true, "The area can not be empty."]
    }
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertyModel);
module.exports = Property;