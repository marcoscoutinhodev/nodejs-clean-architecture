const { MissingParamError } = require("../../utils/errors");

class AuthUseCaseSpy {
    constructor (loadUserByEmailRepository) {
        this.loadUserByEmailRepository = loadUserByEmailRepository;
    }

    async auth (email, password) {
        if(!email)
            throw new MissingParamError("email");

        if(!password)
            throw new MissingParamError("password");

        await this.loadUserByEmailRepository.load(email);
    }
}

const makeSut = () => {
    class LoadUserByEmailRepositorySpy {
        async load (email) {
            this.email = email;
        }
    }
    
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
    const sut = new AuthUseCaseSpy(loadUserByEmailRepositorySpy);

    return {
        sut,
        loadUserByEmailRepositorySpy,
    };
};

describe("Auth UseCase", () => {
    test("Should throw if no email is provided", async () => {
        const { sut } = makeSut();
        const promise = sut.auth(undefined, "any_password");

        expect(promise).rejects.toThrow(new MissingParamError("email"));
    });

    test("Should throw if no password is provided", async () => {
        const { sut } = makeSut();
        const promite = sut.auth("valid_email@email.com", undefined);

        expect(promite).rejects.toThrow(new MissingParamError("password"));
    });

    test("Should call LoadUserByEmailRepository with correct email", async () => {
        const { sut, loadUserByEmailRepositorySpy } = makeSut();
        await sut.auth("any_email@email.com", "any_password");

        expect(loadUserByEmailRepositorySpy.email).toBe("any_email@email.com");
    });
});