import mongoose from "mongoose";
import { AuthenticationError, DatabaseError, NotFoundError, ValidationError } from "../errors/error";
import { UserModel, UserDocument } from "../models/User";
import { ApiResponse, UserFilters } from "@wl-apps/types";

export class UserService {
  async createUser(
    data: Partial<UserDocument>
  ): Promise<ApiResponse<UserDocument>> {
    try {
      const user = new UserModel(data);

      await user.save();
      return {
        success: true,
        data: user.toJSON(),
      };
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError(error.message);
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to create user"
      );
    }
  }

  async getUsers(
    filters: UserFilters = {},
    options: {
      matchType?: "exact" | "contains";
    } = {}
  ): Promise<ApiResponse<UserDocument[]>> {
    try {
      const mongooseFilters: any = { ...filters };
      const { matchType = "exact" } = options;

      if (mongooseFilters.recordId) {
        mongooseFilters._id = mongooseFilters.recordId;
        delete mongooseFilters.recordId;
      }

      for (const [key, value] of Object.entries(mongooseFilters)) {
        if (matchType === "contains" && typeof value === "string") {
          mongooseFilters[key] = { $regex: value, $options: "i" };
        }
      }

      const users = await UserModel.find(mongooseFilters).sort({
        firstName: -1,
      });

      return {
        success: true,
        data: users.map((user) => user.toJSON()),
      };
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to fetch users"
      );
    }
  }

  async updateUser(
    recordId: string,
    data: Partial<UserDocument>
  ): Promise<ApiResponse<UserDocument | null>> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        recordId, // Mongoose will handle conversion from recordId to _id
        {
          ...data,
        },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new NotFoundError("User");
      }

      return {
        success: true,
        data: user.toJSON(), // Will include recordId
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError(error.message);
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to update user"
      );
    }
  }

  async deleteUser(recordId: string): Promise<ApiResponse<boolean>> {
    try {
      const result = await UserModel.findByIdAndDelete(recordId);

      if (!result) {
        throw new NotFoundError("User");
      }

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    }
  }

  async validateUserCredentials(
    credentials: Partial<UserDocument>
  ): Promise<ApiResponse<UserDocument>> {
    try {
      const user = await UserModel.findOne({ email: credentials.email }).select(
        "+password"
      );

      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }

      const isPasswordValid = await user.comparePassword(
        credentials.password || ""
      );

      if (!isPasswordValid) {
        throw new AuthenticationError("Invalid credentials");
      }

      return {
        success: true,
        data: user.toJSON(),
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError(
        error instanceof Error ? error.message : "User validation failed"
      );
    }
  }
}
