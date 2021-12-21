const MongoHelper = require("../helpers/mongo-helper");
const LoadUserByEmailRepository = require("./load-user-by-email-repository");

const makeSut = (db) => {
    const userModel = db.collection("users");
    const sut = new LoadUserByEmailRepository(userModel);

    return {
        sut,
        userModel,
    };
};

describe("LoadUserByEmail Repository", () => {
    let db;

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

    test("Should return null if user is not found", async () => {
        const { sut } = makeSut(db);
        const user = await sut.load("invalid_email@email.com");

        expect(user).toBeNull();
    });

    test("Should return an user if user is found", async () => {        
        const { sut, userModel } = makeSut(db);
        const fakeUser = await userModel.insertOne({
            email: "valid_email@email.com",
            password: "hashed_password",
            name: "any_name",
            age: 28,
            state: "any_state",
        });
        
        const user = await sut.load("valid_email@email.com");

        expect(user).toEqual({
            _id: fakeUser.insertedId,
        });
    });

    test("Should throws if userModel is not provided", async () => {
        const sut = new LoadUserByEmailRepository();
        const promise = sut.load("any_email@email.com");

        expect(promise).rejects.toThrow();
    });
});