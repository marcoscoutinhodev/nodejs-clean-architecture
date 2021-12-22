const MongoHelper = require("../helpers/mongo-helper");
const UpdateAccessTokenRepository = require("./update-access-token-repository");
const { MissingParamError } = require("../../utils/errors/index");

const makeSut = () => {
    return new UpdateAccessTokenRepository();
};

describe("UpdateAccessToken Reposotory", () => {    
    let userModel;
    
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
        userModel = await MongoHelper.getCollection("users");
    });

    beforeEach(async () => {
        await userModel.deleteMany();
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    test("Should update the user with the given accessToken", async () => {
        const sut = makeSut();

        const fakeUser = await userModel.insertOne({
            email: "valid_email@email.com",
            password: "valid_password",
            age: 28,
            state: "any_state",
        });

        await sut.update(fakeUser.insertedId, "valid_token");

        const updatedFakeUser = await userModel.findOne({ _id: fakeUser.insertedId });

        expect(updatedFakeUser.accessToken).toBe("valid_token");
    });

    test("Should throws if params are not provided", () => {
        const sut = makeSut();

        expect(sut.update(undefined, "any_token")).rejects.toThrow(new MissingParamError("userId"));
        expect(sut.update("any_id", undefined)).rejects.toThrow(new MissingParamError("accessToken"));
    });
});