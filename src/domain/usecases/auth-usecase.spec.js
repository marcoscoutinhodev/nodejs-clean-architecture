class AuthUseCaseSpy {
    async auth (email) {
        if(!email)
            throw new Error();
    }
}

const makeSut = () => {
    return new AuthUseCaseSpy();
};

describe("Auth UseCase", () => {
    test("Should throw if no email is provided", async () => {
        const sut = makeSut();
        const promise = sut.auth();

        expect(promise).rejects.toThrow();
    });
});