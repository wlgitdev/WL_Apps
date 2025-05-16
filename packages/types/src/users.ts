import { BaseModel, EntityNamingScheme, FilterConfig } from "./index";

export const UserNamingScheme: EntityNamingScheme = {
  MODEL: 'User',
  SINGULAR: 'User',
  PLURAL: 'Users'
};

export interface User extends BaseModel {
  email: string;
  password: string; // Will be hashed
  firstName: string;
  lastName: string;
  isActive: boolean;
  fullName: string;
  connectedToSpotify: boolean;
}

export type UserFilters = Partial<User>;

export const userFilterConfig: FilterConfig<UserFilters> = (<const>{
  recordId: { type: "string" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
  email: { type: "string" },
  firstName: { type: "string" },
  lastName: { type: "string" },
  isActive: { type: "boolean" },
  fullName: { type: "string" },
  connectedToSpotify: { type: "boolean" },
}) satisfies FilterConfig<UserFilters>;


export interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  fullName(): string;
  isConnectedToSpotify(): Promise<boolean>;
}