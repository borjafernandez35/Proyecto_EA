import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent {
    place: string;
    eventName: string;
    category: string;
    date: string;
    user: string;

}

export interface IEventModel extends IEvent, Document {}

const EventSchema: Schema = new Schema(
    {
        place: { type: String, required: true },
        category: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, required: false, ref: 'User' },
        eventName: { type: String, required: true },
        date: { type: String, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<IEventModel>('Event', EventSchema);
