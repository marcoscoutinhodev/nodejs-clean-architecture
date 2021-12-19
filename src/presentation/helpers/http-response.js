const MissingParamError = require("./missing-param-error");
const UnauthorizedError = require("./unauthorized-error");

class HttpResponse {
    static badRequest (inputName) {
        return {
            statusCode: 400,
            body: new MissingParamError(inputName),
        };
    }

    static serverError (){
        return {
            statusCode: 500,
        };
    }

    static unauthorizedError (){
        return {
            statusCode: 401,
            body: new UnauthorizedError(),
        };
    }
}

module.exports = HttpResponse;