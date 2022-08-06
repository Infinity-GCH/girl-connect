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

// Registration
router.post("/register", async (req, res) => {
    try {
        const {full_name, email, password} = req.body;
        bcrypt.hash(password, 10).then(async function (hash){
            let userDetails = `insert into users (f_name, e_mail, p_word) values ($1,$2,$3)`;
            await db.none(userDetails, [full_name, email, hash]);
        });
        res.json({
            status: "success",
        });
    } catch (e) {
        console.log(e)
        res.json({
            status: "error",
            error: e.message,
        })
    }
})

module.exports = router;