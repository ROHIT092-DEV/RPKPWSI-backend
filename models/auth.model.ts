import mongoose, { Schema } from "mongoose";

export type Role = "user" | "admin" | "moderator";

export interface IUser extends Document {
  fullName: String;
  email: String;
  userName: String;
  password: String;
  role: Role;
  isActive: boolean;
  avatar: String;
  // coverImage?:String

  refreshTokenHash?: String | null;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    // coverImage: {
    //   type: String, // cloudinary url
    // },

    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    isActive: { type: Boolean, default: true },
    refreshTokenHash: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
