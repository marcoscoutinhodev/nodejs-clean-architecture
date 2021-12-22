const { adapt } = require("../adapters/express-router-adapter");
const LoginRouterCompose = require("../composers/login-composers.routes");

module.exports = router => {
    router.post("/login", adapt(LoginRouterCompose.compose()));
};