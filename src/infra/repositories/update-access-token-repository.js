const { MissingParamError } = require("../../utils/errors/index");

class UpdateAccessTokenRepository {
    constructor (userModel) {
        this.userModel = userModel;
    }

    async update (userId, accessToken) {
        if(!userId)
            throw new MissingParamError("userId");

        if(!accessToken)
            throw new MissingParamError("accessToken");

        await this.userModel.updateOne({
            _id: userId,
        }, {
            $set: {
                accessToken: accessToken,
            },
        });
    }
}

module.exports = UpdateAccessTokenRepository;