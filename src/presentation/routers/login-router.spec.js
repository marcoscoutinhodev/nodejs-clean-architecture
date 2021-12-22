const LoginRouter = require("./login-router");
const { 
    UnauthorizedError,
    ServerError,
} = require("../errors");
const {
    MissingParamError,
    InvalidParamError,
} = require("../../utils/errors");

const makeSut = () => {
    const authUseCaseSpy = makeAuthUseCase();
    const emailValidatorSpy = makeEmailValidator();

    const sut = new LoginRouter({ authUseCase: authUseCaseSpy, emailValidator: emailValidatorSpy });

    return { 
        sut, 
        authUseCaseSpy,
        emailValidatorSpy,
    };
};

const makeEmailValidator = () => {
    class EmailValidatorSpy {
        isValid (email) {
            this.email = email;
            
            return this.isEmailValid;
        }
    }

    const emailValidatorSpy = new EmailValidatorSpy();
    emailValidatorSpy.isEmailValid = true;

    return emailValidatorSpy;
};

const makeEmailValidatorWithError = () => {
    class EmailValidatorSpy {
        isValid () {
            throw new Error();
        }
    }
    
    return new EmailValidatorSpy();
};

const makeAuthUseCase = () => {
    class AuthUseCaseSpy {
        async auth (email, password) {
            this.email = email;
            this.password = password;

            return this.accessToken;
        }
    }

    const authUseCaseSpy = new AuthUseCaseSpy();
    authUseCaseSpy.accessToken = "valid_token";

    return authUseCaseSpy;
};

const makeAuthUseCaseWithError = () => {
    class AuthUseCaseSpy {
        async auth () {
            throw new Error();
        }
    }

    return new AuthUseCaseSpy();
};

describe("Login Router", () => {
    test("Should return status 400 if no email is provided", async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                password: "any_password",
            },
        };

        const httpResponse = await sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError("email"));
    });

    test("Should return status 400 if no password is provided", async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                email: "any_email@email.com",
            },
        };

        const httpResponse = await sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError("password"));
    });

    test("Should return 500 if no httpRequest is provided", async () => {
        const { sut } = makeSut();
        
        const httpResponse = await sut.route();

        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError);
    });

    test("Should return 500 if httpRequest has no body", async () => {
        const { sut } = makeSut();
        const httpRequest = {};

        const httpResponse = await sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError);
    });

    test("Must call AuthUseCase with correct params", async () => {
        const { sut, authUseCaseSpy } = makeSut();
        const httpRequest = {
            body: {
                email: "any_email@email.com",
                password: "any_password",
            },
        };

        await sut.route(httpRequest);

        expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
        expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
    });

    test("Should return 401 when invalid credentials are provided", async () => {
        const { sut, authUseCaseSpy } = makeSut();
        authUseCaseSpy.accessToken = "";
        const httpRequest = {
            body: {
                email: "invalid_email@email.com",
                password: "invalid_password",
            },
        };

        const httpResponse = await sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(401);
        expect(httpResponse.body).toEqual(new UnauthorizedError);
    });

    test("Should return 200 when valid credentials are  provided", async () => {
        const { sut, authUseCaseSpy } = makeSut();
        const httpRequest = {
            body: {
                email: "valid_email@email.com",
                password: "valid_password",
            },
        };

        const httpResponse = await sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
    });

    test("Should return 400 if an invalid email is provided", async () => {
        const { sut, emailValidatorSpy } = makeSut();
        emailValidatorSpy.isEmailValid = false;
        const httpRequest = {
            body: {
                email: "invalid_email@email.com",
                password: "any_password",
            },
        };

        const httpResponse = await sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError("email"));
    });

    test("Should call EmailValidator with correct email", async () => {
        const { sut, emailValidatorSpy } = makeSut();
        const httpRequest = {
            body: {
                email: "any_email@email.com",
                password: "any_password",
            },
        };

        await sut.route(httpRequest);

        expect(emailValidatorSpy.email).toBe(httpRequest.body.email);
    });

    test("Should throw if invalid dependencies are provided", async () => {
        const invalid = {};
        const authUseCaseSpy = makeAuthUseCase();
        const emailValidatorSpy = makeEmailValidator();
        
        const suts = [].concat(
            new LoginRouter(),
            new LoginRouter(invalid),
            new LoginRouter({
                authUseCase: authUseCaseSpy,
                emailValidator: invalid,
            }),
            new LoginRouter({
                authUseCase: invalid,
                emailValidator: emailValidatorSpy,
            })
        );

        const httpRequest = {
            email: "any_email@email.com",
            password: "any_password",
        };
        
        for(const sut of suts) {
            const httpResponse = await sut.route(httpRequest);
    
            expect(httpResponse.statusCode).toBe(500);
            expect(httpResponse.body).toEqual(new ServerError());
        }
    });

    test("Should throw if any dependency throws", async () => {
        const authUseCase = makeAuthUseCase();
        const emailValidator = makeEmailValidator();

        const suts = [].concat(
            new LoginRouter({
                authUseCase: makeAuthUseCaseWithError(),
                emailValidator,
            }),
            new LoginRouter({
                authUseCase,
                emailValidator: makeEmailValidatorWithError(),
            })
        );

        const httpRequest = {
            email: "any_email@email.com",
            password: "any_password",
        };

        for(const sut of suts) {
            const httpResponse = await sut.route(httpRequest);

            expect(httpResponse.statusCode).toBe(500);
            expect(httpResponse.body).toEqual(new ServerError());
        }
    });
});