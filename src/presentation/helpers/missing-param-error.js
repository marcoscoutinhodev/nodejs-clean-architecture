class MissingParamError extends Error {
    constructor (inputName) {
        super(`Missing param: ${inputName}`);
    }
}

module.exports = MissingParamError;