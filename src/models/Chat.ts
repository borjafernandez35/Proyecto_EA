import mongoose, { Document, Schema } from 'mongoose';

export interface IChat {
    photo: string;
    groupName: string;
    idParticipants: string[];
    idMessages: string[];
    idEvent: string;
}

export interface IChatModel extends IChat, Document {}

const ChatSchema: Schema = new Schema(
    {
        photo: { type: String, required: true },
        groupName: { type: String, required: true },
        idParticipants: [{ type: Schema.Types.ObjectId, required: true, ref: 'User' }],
        idMessages: [{ type: Schema.Types.ObjectId, required: true, ref: 'Message' }],
        idEvent: { type: Schema.Types.ObjectId, required: true, ref: 'Event' }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export default mongoose.model<IChatModel>('Chat', ChatSchema);
