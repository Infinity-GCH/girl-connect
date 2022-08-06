const router = require("express").Router();
const cors = require("cors");
require("dotenv").config

router.use(cors());

// Db Connect
const DATABASE_URL = process.env.DB_URL;
const config = {
	connectionString: DATABASE_URL,
};
if (process.env.NODE_ENV == "production") {
	config.ssl = {
		rejectUnauthorized: false,
	};
}