const loginRouter = require("../composers/login-composers.routes");

module.exports = router => {
    router.post("/login", loginRouter);
};