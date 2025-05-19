"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFilterConfig = exports.UserNamingScheme = void 0;
exports.UserNamingScheme = {
    MODEL: 'User',
    SINGULAR: 'User',
    PLURAL: 'Users'
};
exports.userFilterConfig = {
    recordId: { type: "string" },
    createdAt: { type: "date" },
    updatedAt: { type: "date" },
    email: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    isActive: { type: "boolean" },
    fullName: { type: "string" },
    connectedToSpotify: { type: "boolean" },
};
//# sourceMappingURL=users.js.map