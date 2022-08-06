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
		const { full_name, email, password } = req.body;
		bcrypt.hash(password, 10).then(async function (hash) {
			let userDetails = `insert into users (full_name, email, password) values ($1,$2,$3)`;
			await db.none(userDetails, [full_name, email, hash]);
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
		// console.log(user);

		const dbPassword = user.password;
		const validPass = await bcrypt.compare(password, dbPassword);
		if (!user) {
			return res.status(400).send("User does not exist");
		}else if (!validPass) {
			return res.status(400).send("Invalid email or password");
		}else{
			return res.status(200).send("Login success");
		}
		
	} catch (error) {
		res.json(error);
	}
}); 

// Create Request
router.post("/request" , async (req, res) => {
    try {
        const { type, description } = req.body;
        let userRequest = `insert into requests (type, description) values ($1,$2)`;
        await db.none(userRequest, [type, description]);
			res.json({
				status: "success",
			});
    } catch (e) {
        console.log(e);
		res.json({
			status: "error",
			error: e.message
		});
    }
});

// Feeds
router.get("/feeds", async (req, res) => {
    try {
        const feed = await db.many(`select * from requests where status = open`)
        res.json({data: feed})
    } catch (e) {
        console.log(e);
		res.json({
			status: "error",
			error: e.message
        });
	}
});

module.exports = router;
