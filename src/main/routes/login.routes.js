const loginRouter = require("../composers/login-composers.routes");
const ExpressRouterAdapter = require("../adapters/express-router-adapter");

module.exports = router => {
    router.post("/login", ExpressRouterAdapter.adapt(loginRouter));
};