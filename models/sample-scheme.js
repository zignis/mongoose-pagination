const mongoose = require("mongoose");
//Sample scheme for pagination
module.exports = mongoose.model("Sample", new mongoose.Schema({
    email: { type: String },
    pass: { type: String }
}));
 
