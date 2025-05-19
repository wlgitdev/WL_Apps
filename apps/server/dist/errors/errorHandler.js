"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = require("jsonwebtoken");
const error_1 = require("./error");
const errorHandler = (err, req, res, next) => {
    // Default error response structure
    let apiResponse = {
        success: false,
        data: {
            message: err.message || 'Internal server error'
        }
    };
    // Add stack trace in development environment
    if (process.env.NODE_ENV === 'development') {
        apiResponse.data.stack = err.stack;
    }
    // Handle custom AppError instances
    if (err instanceof error_1.AppError) {
        res.status(err.statusCode).json(apiResponse);
        return;
    }
    // Handle Mongoose validation errors
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        apiResponse.data.message = Object.values(err.errors)
            .map(error => error.message)
            .join(', ');
        apiResponse.data.code = 'VALIDATION_ERROR';
        res.status(400).json(apiResponse);
        return;
    }
    // Handle Mongoose CastError (invalid ObjectId)
    if (err instanceof mongoose_1.default.Error.CastError) {
        apiResponse.data.message = 'Invalid ID format';
        apiResponse.data.code = 'INVALID_ID';
        res.status(400).json(apiResponse);
        return;
    }
    // Handle MongoDB duplicate key error
    if (err.name === 'MongoError' && err.code === 11000) {
        apiResponse.data.message = 'Duplicate field value';
        apiResponse.data.code = 'DUPLICATE_FIELD';
        res.status(400).json(apiResponse);
        return;
    }
    // Handle JWT errors
    if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
        apiResponse.data.message = 'Invalid token';
        apiResponse.data.code = 'INVALID_TOKEN';
        res.status(401).json(apiResponse);
        return;
    }
    // Handle unknown errors
    console.error('Unhandled error:', err);
    apiResponse.data.message = 'Internal server error';
    apiResponse.data.code = 'INTERNAL_SERVER_ERROR';
    res.status(500).json(apiResponse);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map