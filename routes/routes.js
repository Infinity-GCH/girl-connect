const router = require("express").Router();
const bcrypt = require("bcrypt");
const PgPromise = require("pg-promise");
const pgp = PgPromise({});
require("dotenv").config();

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

// Registration
router.post("/register", async (req, res) => {
	try {
		const { full_name, email, password, contact } = req.body;
		bcrypt.hash(password, 10).then(async function (hash) {
			let userDetails = `insert into users (full_name, email, password, contact) values ($1,$2,$3,$4)`;
			await db.none(userDetails, [full_name, email, hash, contact]);
			res.json({
				status: "success",
			});
		});
	} catch (e) {
		console.log(e);
		res.json({
			status: "error",
			error: e.message,
		});
	}
});

//Login
router.post("/login", async (req, res) => {
	try {
		const { password, email } = req.body;
		const user = await db.oneOrNone(`select * from users where email=$1`, [
			email,
		]);
		console.log(user);
		const dbPassword = user.password;
		const validPass = await bcrypt.compare(password, dbPassword);
		if (!user.email || user.email == "") {
			res.json("User does not exist");
		} else if (!validPass) {
			res.json("Invalid email or password");
		} else {
			res.json("Login success");
		}
	} catch (error) {
		res.json(error);
	}
});

// Create Request
router.post("/request", async (req, res) => {
	try {
		const { type, description, email } = req.body;
		let userRef = await db.one("select user_id from users where email = $1", [
			email,
		]);

		let userId = userRef.user_id;
		await db.none(`insert into requests (type, description, status, user_id) values ($1,$2,$3, $4)`, [type, description, "open", userId]);
		res.json({
			status: "success",
		});
	} catch (e) {
		console.log(e);
		res.json({
			status: "error",
			error: e.message,
		});
	}
});

// Feeds
router.get("/feeds", async (req, res) => {
	try {
		const feed = await db.any(`select * from requests`);
		res.json({ data: feed });
	} catch (e) {
		console.log(e);
		res.json({
			status: "error",
			error: e.message,
		});
	}
});

module.exports = router;
