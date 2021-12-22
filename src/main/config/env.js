require("dotenv/config");

module.exports = {
    mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/clean-node-api",
    serverPortDev: process.env.SERVER_PORT || 4001,
    jwtKeySecret: process.env.JWT_KEY_SECRET || "secret_dev",
};