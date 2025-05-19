import { Document, Model } from "mongoose";
import { User, UserMethods } from "@wl-apps/types";
export interface UserDocument extends User, Document {
}
type UserModel = Model<UserDocument, {}, UserMethods>;
export declare const UserModel: UserModel;
export {};
//# sourceMappingURL=User.d.ts.map