const { MongoClient } = require("mongodb");

class LoadUserByEmailRepository {
    constructor (userModel) {
        this.userModel = userModel;
    }

    async load (email) {
        const user = await this.userModel.findOne({ email });

        return user;
    }
}

const makeSut = (db) => {
    const userModel = db.collection("users");
    const sut = new LoadUserByEmailRepository(userModel);

    return {
        sut,
        userModel,
    };
};

describe("LoadUserByEmail Repository", () => {
    let client, db;

    beforeAll(async () => {
        client = await MongoClient.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        db = client.db();
    });

    beforeEach(async () => {
        await db.collection("users").deleteMany();
    });

    afterAll(async () => {
        await client.close();
    });

    test("Should return null if user is not found", async () => {
        const { sut } = makeSut(db);
        const user = await sut.load("invalid_email@email.com");

        expect(user).toBeNull();
    });

    test("Should return an user if user is found", async () => {        
        const { sut, userModel } = makeSut(db);
        await userModel.insertOne({
            email: "valid_email@email.com",
        });

        const user = await sut.load("valid_email@email.com");

        expect(user.email).toBe("valid_email@email.com");
    });
});