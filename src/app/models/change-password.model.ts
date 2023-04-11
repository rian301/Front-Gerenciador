export class ChangePasswordModel {
    userId: string = null;
    oldPassword: string = null;
    newPassword: string = null;
    confirmPassword: string = null;

    constructor(oldPassword: string = null, userId: string = null, newPassword: string, confirmPassword: string) {
        this.userId = userId;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
        this.confirmPassword = confirmPassword;
    }
}