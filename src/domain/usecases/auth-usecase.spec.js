const { MissingParamError } = require("../../utils/errors");

class AuthUseCaseSpy {
    async auth (email, password) {
        if(!email)
            throw new MissingParamError("email");

        if(!password)
            throw new MissingParamError("password");
    }
}

const makeSut = () => {
    return new AuthUseCaseSpy();
};

describe("Auth UseCase", () => {
    test("Should throw if no email is provided", async () => {
        const sut = makeSut();
        const promise = sut.auth(undefined, "any_password");

        expect(promise).rejects.toThrow(new MissingParamError("email"));
    });

    test("Should throw if no password is provided", async () => {
        const sut = makeSut();
        const promite = sut.auth("valid_email@email.com", undefined);

        expect(promite).rejects.toThrow(new MissingParamError("password"));
    });
});