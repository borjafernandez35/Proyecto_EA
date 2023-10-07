import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent {
    coordinates: [number, number];
    eventName: string;
    //category: [Category];
    date: Date;
    user: string;
    description: string;
    assistants: string[];
    link: string; //not required
    photo: string;
}

export interface IEventModel extends IEvent, Document {}

const EventSchema: Schema = new Schema(
    {
        place: { type: String, required: true },
        category: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, required: false, ref: 'User' },
        eventName: { type: String, required: true },
        date: { type: Date, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<IEventModel>('Event', EventSchema);
