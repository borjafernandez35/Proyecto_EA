import mongoose, { Document, Schema } from 'mongoose';
import Category from './Category';

export interface IUser {
    userName: string;
    email: string;
    //idUser: number;
    birthDate: Date;
    password: string;
    avatar: string;
    createdEventsId: string;
    joinedEventsId: string;
    idCategories: string[];
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        userName: { type: String, required: true },
        email: { type: String, required: true },
        //idUser: { type: Number, required: true },
        birthDate: { type: Date, required: true },
        password: { type: String, required: true },
        avatar: { type: String, required: true },
        createdEventsId: { type: Schema.Types.ObjectId, required: true, ref: 'Event' },
        joinedEventsId: { type: Schema.Types.ObjectId, required: true, ref: 'Event' },
        idCategories: [{ type: Schema.Types.ObjectId, required: true, ref: 'Category' }]
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export default mongoose.model<IUserModel>('User', UserSchema);
