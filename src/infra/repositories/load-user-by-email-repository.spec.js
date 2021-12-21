const { MongoClient } = require("mongodb");

class LoadUserByEmailRepository {
    constructor (userModel) {
        this.userModel = userModel;
    }

    async load (email) {
        const user = await this.userModel.findOne({ 
            email,
        }, {
            projection: {
                _id: 1,
            },
        });

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
});