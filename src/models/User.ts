import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
    userName: string;
    email: string;
    idUser: Number;
    birthDate: Date;
    password: string;
    avatar: string;
    createdEventsId: string[];
    joinedEventsId: string[];
    idCategories: string[];
    role: string;
    encryptPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        userName: { type: String, required: true },
        email: { type: String, required: true },
        idUser: { type: Number, required: false },
        birthDate: { type: Date, required: false },
        password: { type: String, required: true },
        avatar: { type: String, required: false },
        createdEventsId: [{ type: Schema.Types.ObjectId, required: false, ref: 'Event' }],
        joinedEventsId: [{ type: Schema.Types.ObjectId, required: false, ref: 'Event' }],
        idCategories: [{ type: Schema.Types.ObjectId, required: false, ref: 'Category' }],
        role: { type: String, required: false }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
UserSchema.methods.encryptPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};
UserSchema.methods.validatePassword = async function (password: string) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.validateEmail = async function (email: string) {};

export default mongoose.model<IUserModel>('User', UserSchema);
