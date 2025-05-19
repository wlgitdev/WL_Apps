"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const error_1 = require("../errors/error");
const User_1 = require("../models/User");
class UserService {
    async createUser(data) {
        try {
            const user = new User_1.UserModel(data);
            await user.save();
            return {
                success: true,
                data: user.toJSON(),
            };
        }
        catch (error) {
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                throw new error_1.ValidationError(error.message);
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : "Failed to create user");
        }
    }
    async getUsers(filters = {}, options = {}) {
        try {
            const mongooseFilters = { ...filters };
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
            const users = await User_1.UserModel.find(mongooseFilters).sort({
                firstName: -1,
            });
            return {
                success: true,
                data: users.map((user) => user.toJSON()),
            };
        }
        catch (error) {
            throw new error_1.DatabaseError(error instanceof Error ? error.message : "Failed to fetch users");
        }
    }
    async updateUser(recordId, data) {
        try {
            const user = await User_1.UserModel.findByIdAndUpdate(recordId, // Mongoose will handle conversion from recordId to _id
            {
                ...data,
            }, { new: true, runValidators: true });
            if (!user) {
                throw new error_1.NotFoundError("User");
            }
            return {
                success: true,
                data: user.toJSON(), // Will include recordId
            };
        }
        catch (error) {
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                throw new error_1.ValidationError(error.message);
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : "Failed to update user");
        }
    }
    async deleteUser(recordId) {
        try {
            const result = await User_1.UserModel.findByIdAndDelete(recordId);
            if (!result) {
                throw new error_1.NotFoundError("User");
            }
            return {
                success: true,
                data: true,
            };
        }
        catch (error) {
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : "Failed to delete user");
        }
    }
    async validateUserCredentials(credentials) {
        try {
            const user = await User_1.UserModel.findOne({ email: credentials.email }).select("+password");
            if (!user) {
                throw new error_1.AuthenticationError("Invalid credentials");
            }
            const isPasswordValid = await user.comparePassword(credentials.password || "");
            if (!isPasswordValid) {
                throw new error_1.AuthenticationError("Invalid credentials");
            }
            return {
                success: true,
                data: user.toJSON(),
            };
        }
        catch (error) {
            if (error instanceof error_1.AuthenticationError) {
                throw error;
            }
            throw new error_1.AuthenticationError(error instanceof Error ? error.message : "User validation failed");
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map