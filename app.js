const express = require("express");
const app = express();
const routes = require("./routes/routes")
require("dotenv").config()
app.use(express.json());

app.use("/connect", routes);
app.get("/", (req, res)=>{
    res.send("backend deployed!");
})

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`App running on port ${PORT}`);
})