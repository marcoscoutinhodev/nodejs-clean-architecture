require("dotenv/config");

module.exports = {
    mongoUrl: process.env.MONGO_URL || "mongodb://localhost",
    serverPortDev: process.env.SERVER_PORT_DEV,
};