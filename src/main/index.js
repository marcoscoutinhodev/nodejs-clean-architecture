const MongoHelper = require("../infra/helpers/mongo-helper");
const env = require("./config/env");

MongoHelper
    .connect(env.mongoUrl)
    .then(() => {
        const app = require("./config/app");
        
        app.listen(env.serverPortDev, () => {
            console.log("Server is running...");
        });
    })
    .catch(console.error);
