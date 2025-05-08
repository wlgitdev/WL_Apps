// User-related types

import { BaseModel, FilterConfig } from "./index";

export interface User extends BaseModel {
  email: string;
  password: string; // Will be hashed
  firstName: string;
  lastName: string;
  isActive: boolean;
}

export type UserFilters = Partial<User>;

export const userFilterConfig: FilterConfig<UserFilters> = (<const>{
  recordId: { type: "string" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
  email: { type: "string" },
  password: { type: "string" },
  firstName: { type: "string" },
  lastName: { type: "string" },
  isActive: { type: "boolean" },
}) satisfies FilterConfig<UserFilters>;


export interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  fullName(): string;
}

