const MissingParamError = require("./missing-param-error");

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
}

module.exports = HttpResponse;