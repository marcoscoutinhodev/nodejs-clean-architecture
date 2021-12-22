const MongoHelper = require("../helpers/mongo-helper");
const LoadUserByEmailRepository = require("./load-user-by-email-repository");
const { MissingParamError } = require("../../utils/errors/index");

const makeSut = () => {
    return new LoadUserByEmailRepository();
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
        const sut = makeSut(db);
        const user = await sut.load("invalid_email@email.com");

        expect(user).toBeNull();
    });

    test("Should return an user if user is found", async () => {        
        const sut = makeSut(db);
        const fakeUser = await db.collection("users").insertOne({
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

    test("Should throws if email is not provided", async () => {
        const sut = makeSut(db);
        const promise = sut.load();

        expect(promise).rejects.toThrow(new MissingParamError("email"));
    });
});