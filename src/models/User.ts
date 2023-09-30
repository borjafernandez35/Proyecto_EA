import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
    userName: string;
    email: string;
    idUser: number;
    age: number;
    password: string;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        userName: { type: String, required: true },
        email: { type: String, required: true },
        idUser: { type: Number, required: true },
        age: { type: Number, required: true },
        password: { type: String, required: true }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export default mongoose.model<IUserModel>('User', UserSchema);
