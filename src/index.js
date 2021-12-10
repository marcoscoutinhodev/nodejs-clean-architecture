require("dotenv/config");
const express = require("express");

const app = express();

app.listen(process.env.SERVER_PORT_DEV, () => {
	console.log("Server is running...");
});