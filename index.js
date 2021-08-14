const express = require("express");
const app = express();
const mongoose = require('mongoose');
const scheme = require('./models/sample-scheme.js'); //Path to your data scheme
const items_per_page = 20; //Maximum number of items to display per page

//Connecting to the database
mongoose.connect(YOUR_MONGO_URL, {        
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to the Mongodb database.");
}).catch((err) => {
  console.log("Unable to connect to the Mongodb database. Error:" + err);
});

//Using root URI
app.get("/", async (req, res) => {
    let { page, sort } = req.query; //Get URL queries
    if(!page){page=1;} //Set the page number to default if not specified in the URL
    page=parseInt(page); //We received the page number as a string, parsing it into an integer
    const total_docs = await scheme.find().estimatedDocumentCount(); //Fetch total number of documents (.count() method was discontinued, using .estimatedDocumentCount() instead)
    const max_pagination=Math.round(total_docs/items_per_page); //Get the maximum number of possible pages and round to the nearest integer
    if(page>max_pagination)page=max_pagination; //If the specified page number is greater than the last page index, redirect to the last page
  
    const main_docs = await scheme.find().limit(items_per_page).skip((items_per_page-1)*20); 
    // Fetch the main documents with limit, and skip the documents accroding to the
    // page number. We use -1 as for the first page we don't have to skip any documents. You can also use .sort() method to sort the documents/
    res.send({docs:main_docs}); //Finally Send the documents
});

//Express defaults
app.listen(YOUR_PORT, () => {
    console.log("Application has started!");
});