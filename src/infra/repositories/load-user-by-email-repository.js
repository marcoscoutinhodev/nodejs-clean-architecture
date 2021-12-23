const { MissingParamError } = require("../../utils/errors/index");
const MongoHelper = require("../helpers/mongo-helper");

class LoadUserByEmailRepository {
    async load (email) {
        if(!email)
            throw new MissingParamError("email");

        const userModel = await MongoHelper.getCollection("users");

        const user = await userModel.findOne({ 
            email,
        }, {
            projection: {
                _id: 1,
                password: true,
            },
        });

        return user;
    }
}

module.exports = LoadUserByEmailRepository;