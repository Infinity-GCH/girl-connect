const express = require("express");
const app = express();
require("dotenv").config()

app.get("/", (req, res)=>{
    res.send("backend deployed!");
})

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`App running on port ${PORT}`);
})