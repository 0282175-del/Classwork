import mongoose from "mongoose";

const USR_ROLES = ['User', 'Admin', 'Superuser'];

const UserSchema = new mongoose.Schema(
    {
        username:    { type: String, required: true, unique: true, trim: true },
        name:        { type: String, trim: true },
        email:       { type: String, required: true, trim: true },
        password:    { type: String, required: true, trim: true },
        role:        { type: String, default: 'User' },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);