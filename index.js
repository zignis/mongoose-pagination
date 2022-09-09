const express = require("express");
const mongoose = require('mongoose');
const scheme = require('./models/sample-scheme.js'); // Path to your data scheme

const app = express();
const itemsPerPage = 20; // Records per page

// Connecting to the database
mongoose.connect(YOUR_MONGO_URL, {        
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to the Mongodb database.");
}).catch((err) => {
  console.log("Unable to connect to the Mongodb database. Error:" + err);
});

// Using root
app.get("/", async (req, res) => {
    let { page = '1', sort } = req.query; // Get URL query params
    page = Number.parseInt(page, 10); // Casting to an integer
  
    const totalDocs = await scheme.find().estimatedDocumentCount(); 
    // Fetch total number of documents (.count() method was discontinued, using .estimatedDocumentCount() instead)
  
    const maxPagination = Math.round(totalDocs / itemsPerPage); // Get the maximum number of possible pages and round to the nearest integer
    if (page > maxPagination) page = maxPagination; 
    // If the specified page number is greater
    // than the last page's index, return the last chunk
  
    const docChunk = await scheme.find().limit(itemsPerPage).skip((itemsPerPage - 1) * 20); 
    // Fetch the documents under the limit, and skip the documents according to the
    // page number. We use -1 as for the first page we don't have to skip any documents.
    // You can also use .sort() method to sort the documents

    return res.status(200).json({
      docs: docChunk
    });
});

// Express defaults
app.listen(YOUR_PORT, () => {
    console.log("Application has started!");
});
