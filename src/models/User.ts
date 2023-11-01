import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
    userName: string;
    email: string;
    //idUser: Object._id;
    birthDate: Date;
    password: string;
    avatar: string;
    createdEventsId: string[];
    joinedEventsId: string[];
    idCategories: string[];
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        userName: { type: String, required: true },
        email: { type: String, required: true },
        //idUser: { type: Number, required: true },
        birthDate: { type: Date, required: false },
        password: { type: String, required: true },
        avatar: { type: String, required: false },
        createdEventsId: [{ type: Schema.Types.ObjectId, required: false, ref: 'Event' }],
        joinedEventsId: [{ type: Schema.Types.ObjectId, required: false, ref: 'Event' }],
        idCategories: [{ type: Schema.Types.ObjectId, required: false, ref: 'Category' }]
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export default mongoose.model<IUserModel>('User', UserSchema);
