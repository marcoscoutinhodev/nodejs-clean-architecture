const MongoHelper = require("../helpers/mongo-helper");
const UpdateAccessTokenRepository = require("./update-access-token-repository");
const { MissingParamError } = require("../../utils/errors/index");

let db;

const makeSut = () => {
    const userModel = db.collection("users");
    const sut = new UpdateAccessTokenRepository(userModel);

    return {
        sut,
        userModel,
    };
};

describe("UpdateAccessToken Reposotory", () => {    
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
        db = await MongoHelper.getDb();
    });

    beforeEach(async () => {
        await db.collection("users").deleteMany();
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    test("Should update the user with the given accessToken", async () => {
        const { sut, userModel } = makeSut();

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

    test("Should throws if userModel is not provided", async () => {
        const sut = new UpdateAccessTokenRepository();
        const promise = sut.update("any_user_id", "any_token");

        expect(promise).rejects.toThrow();
    });

    test("Should throws if params are not provided", () => {
        const { sut } = makeSut();

        expect(sut.update(undefined, "any_token")).rejects.toThrow(new MissingParamError("userId"));
        expect(sut.update("any_id", undefined)).rejects.toThrow(new MissingParamError("accessToken"));
    });
});