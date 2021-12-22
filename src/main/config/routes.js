const { Router } = require("express");
const fb = require("fast-glob");

const router = Router();

module.exports = app => {
    app.use("/api", router);
    fb.sync("**/src/main/routes/**.js").forEach(file => {
        require(`../../../${file}`)(router);
    });
};