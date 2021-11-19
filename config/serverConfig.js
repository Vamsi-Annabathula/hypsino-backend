require("dotenv").config();

module.exports = {
	PORT: process.env.PORT,
	DATABASE: process.env.DATABASE,
	NODE_ENV: process.env.NODE_ENV,
	//SECRET: process.env.SECRET //for auth
};