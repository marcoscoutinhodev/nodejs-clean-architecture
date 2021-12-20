class ServerError extends Error {
    constructor () {
        super("Internal server error, try again in a few minutes");

        this.name = "ServerError";
    }
}

module.exports = ServerError;