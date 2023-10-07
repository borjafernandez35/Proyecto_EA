import mongoose, { Document, Schema } from 'mongoose';
import User from './User';

export interface IMessage {
    text: string;
    idUser: string;
}

export interface IMessageModel extends IMessage, Document {}

const MessageSchema: Schema = new Schema(
    {
        text: { type: String, required: true },
        idUser: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export default mongoose.model<IMessageModel>('Message', MessageSchema);
