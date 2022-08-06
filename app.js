const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
const routes = require("./routes/routes")
require("dotenv").config()
app.use(cors());

app.use("/connect", routes);

app.get("/", (req, res)=>{
    res.send("backend deployed!");
})

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`App running on port ${PORT}`);
})