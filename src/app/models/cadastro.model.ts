import { EnderecoModel } from "./endereco.model";

export class CadastroModel {
    name: string = null;        
    cpf: string = null;
    birthDate: string = null;
    phoneNumber: number = null;
    email: string = null;
    username: string = null;
    password: string = null;
    confirmPassword: string = null;    
    address: EnderecoModel = null;

    constructor(name: string, cpf: string, birthDate: string, phoneNumber: number, email: string, username: string, password: string, confirmPassword: string) {
        this.name = name;
        this.cpf = cpf;
        this.birthDate = birthDate;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.username = username;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }
}