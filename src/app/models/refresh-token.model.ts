export class RefreshTokenModel {
    code: string = null;
    idUser: number = null;
    idAccount: number = null;

    constructor(code: string, idUser: number, idAccount: number) {
        this.code = code;
        this.idUser = idUser;
        this.idAccount = idAccount;
    }
};