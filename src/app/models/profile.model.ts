import { PermissionModel } from "./permission.model";

export class ProfileModel {
    id: number = null;
    name: string = null;
    permissions: PermissionModel[];    
}
