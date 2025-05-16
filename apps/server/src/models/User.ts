import mongoose, { Schema, Document, Model } from "mongoose";
import { User, UserMethods } from "@wl-apps/types";
import {
  createStringConfig,
  createBooleanConfig,
} from "./commonValidators";
import bcrypt from "bcryptjs";
import { SpotifyTokensService } from '../services/Sortify/spotifyTokens.service';

export interface UserDocument extends User, Document {}
type UserModel = Model<UserDocument, {}, UserMethods>;

const userSchema = new Schema(
  {
    email: createStringConfig({
      minLength: 2,
      maxLength: 200,
      required: true,
      pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      patternMessage: "Email address must be valid",
      context: {
        entityName: "User",
        fieldDisplayName: "User Email",
      },
    }),
    password: createStringConfig({
      minLength: 8,
      maxLength: 50,
      required: true,
      allowSelect: false,
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      patternMessage:
        "User Password must contain at least one letter and one number",
      context: {
        entityName: "User",
        fieldDisplayName: "User Password",
      },
    }),
    firstName: createStringConfig({
      minLength: 2,
      maxLength: 30,
      required: true,
      pattern: /^[A-Za-z\u00C0-\u017F]{2,30}(?:[-'][A-Za-z\u00C0-\u017F]+)*$/,
      patternMessage:
        "First name should be 2-30 characters long, can include accented letters and hyphens",
      context: {
        entityName: "User",
        fieldDisplayName: "User First Name",
      },
    }),
    lastName: createStringConfig({
      minLength: 2,
      maxLength: 30,
      required: true,
      pattern: /^[A-Za-z\u00C0-\u017F]{2,30}(?:[-'][A-Za-z\u00C0-\u017F]+)*$/,
      patternMessage:
        "Last name should be 2-30 characters long, can include accented letters and hyphens",
      context: {
        entityName: "User",
        fieldDisplayName: "User Last Name",
      },
    }),
    isActive: createBooleanConfig({
      required: true,
      context: {
        entityName: "User",
        fieldDisplayName: "User Is Active",
      },
    }),
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.recordId = ret._id;
        delete ret._id;
        delete ret.id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.recordId = ret._id;
        delete ret._id;
        delete ret.id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

// Virtual for recordId that maps to _id
userSchema.virtual('recordId').get(function() {
  return this._id;
});

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods.isConnectedToSpotify = async function () {
  const spotifyTokensService = new SpotifyTokensService();
  const result = await spotifyTokensService.getSpotifyTokens({ userId: this._id.toString() });
  return result.success && result.data.length > 0;
};

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified or new
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    
    this.password = await bcrypt.hash(this.password.toString(), 12);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Update service queries to use _id internally
userSchema.statics.findByRecordId = function(recordId: string) {
  return this.findById(recordId);
};

userSchema.methods.comparePassword = async function (
  this: UserDocument,
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<UserDocument, UserModel>(
  "User",
  userSchema
);
