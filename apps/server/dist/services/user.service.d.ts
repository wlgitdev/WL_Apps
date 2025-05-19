import { UserDocument } from "../models/User";
import { ApiResponse, UserFilters } from "@wl-apps/types";
export declare class UserService {
    createUser(data: Partial<UserDocument>): Promise<ApiResponse<UserDocument>>;
    getUsers(filters?: UserFilters, options?: {
        matchType?: "exact" | "contains";
    }): Promise<ApiResponse<UserDocument[]>>;
    updateUser(recordId: string, data: Partial<UserDocument>): Promise<ApiResponse<UserDocument | null>>;
    deleteUser(recordId: string): Promise<ApiResponse<boolean>>;
    validateUserCredentials(credentials: Partial<UserDocument>): Promise<ApiResponse<UserDocument>>;
}
//# sourceMappingURL=user.service.d.ts.map