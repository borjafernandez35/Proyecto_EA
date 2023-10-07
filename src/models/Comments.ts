import mongoose, { Document, Schema } from 'mongoose';

export interface IComment {
    userName: string;
    avatar: string;
    text: [string];
    punctuation: number; //valorar de 1 a 5, estrellitas.
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
