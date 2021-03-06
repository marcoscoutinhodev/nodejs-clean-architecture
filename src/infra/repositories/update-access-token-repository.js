const { MissingParamError } = require("../../utils/errors/index");
const MongoHelper = require("../helpers/mongo-helper");

class UpdateAccessTokenRepository {
    async update (userId, accessToken) {
        if(!userId)
            throw new MissingParamError("userId");

        if(!accessToken)
            throw new MissingParamError("accessToken");
        
        const userModel = await MongoHelper.getCollection("users");
        
        await userModel.updateOne({
            _id: userId,
        }, {
            $set: {
                accessToken: accessToken,
            },
        });
    }
}

module.exports = UpdateAccessTokenRepository;