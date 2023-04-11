import { LoginExternoModel } from "./login-externo";

export class UserModel {
    codigo: number = null;
    nome: string = null;
    account_id: number = null;

    id: number = null;
    userProfileId: number = null;
    email: string = null;
    username: string = null;
    name: string = null;
    profileName: string = null;
    phoneNumber: string = null;
    active: boolean = null;

    cpf: string = null;
    password: string = null;
    loginExterno: LoginExternoModel;
    token: string = null;
}