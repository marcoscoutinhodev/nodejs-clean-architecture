class MissingParamError extends Error {
    constructor (inputName) {
        super(`Missing param: ${inputName}`);

        this.name = "MissingParamError";
    }
}

module.exports = MissingParamError;