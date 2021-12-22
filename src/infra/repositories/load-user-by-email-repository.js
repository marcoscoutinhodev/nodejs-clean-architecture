const { MissingParamError } = require("../../utils/errors/index");
const MongoHelper = require("../helpers/mongo-helper");

class LoadUserByEmailRepository {
    async load (email) {
        if(!email)
            throw new MissingParamError("email");

        const db = await MongoHelper.getDb();
        const user = await db.collection("users").findOne({ 
            email,
        }, {
            projection: {
                _id: 1,
            },
        });

        return user;
    }
}

module.exports = LoadUserByEmailRepository;