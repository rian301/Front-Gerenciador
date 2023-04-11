export class LoginModel {
    email: string = null;
    password: string = null;
    rememberMe: boolean = false;

    constructor(email: string = null, password: string = null, rememberMe: boolean = false) {
        this.email = email;
        this.password = password;
        this.rememberMe = rememberMe;
    }
}
