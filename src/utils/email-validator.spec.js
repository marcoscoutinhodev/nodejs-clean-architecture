class EmailValidatorSpy {
    isValid () {
        return true;
    }
}

describe("Email Validator", () => {
    test("Should return true if validator returns true", () => {
        const sut = new EmailValidatorSpy();
        const isEmailValid = sut.isValid("valid_email@email.com");

        expect(isEmailValid).toBe(true);
    });
});