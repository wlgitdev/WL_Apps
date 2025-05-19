import { BaseModel, EntityNamingScheme, FilterConfig } from "./index";
export declare const UserNamingScheme: EntityNamingScheme;
export interface User extends BaseModel {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    fullName: string;
    connectedToSpotify: boolean;
}
export type UserFilters = Partial<User>;
export declare const userFilterConfig: FilterConfig<UserFilters>;
export interface UserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
    fullName(): string;
    isConnectedToSpotify(): Promise<boolean>;
}
//# sourceMappingURL=users.d.ts.map