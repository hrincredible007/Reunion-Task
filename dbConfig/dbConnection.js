const mongoose = require('mongoose');
const dbConnection = async() => {
    try {
        const dbConnection = await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database Connected Successfully")
        
    } catch (error) {
        console.log("DB Error: "+error)
        
    }
}
module.exports = dbConnection;