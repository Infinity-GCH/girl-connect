const router = require("express").Router();
const cors = require("cors");
const PgPromise = require("pg-promise");
const pgp = PgPromise({});
require("dotenv").config();

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

const db = pgp(config);