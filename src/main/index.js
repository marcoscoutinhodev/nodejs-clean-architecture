require("dotenv/config");
const app = require("./config/app");

app.listen(process.env.SERVER_PORT_DEV, () => {
    console.log("Server is running...");
});