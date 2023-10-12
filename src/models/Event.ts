import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent {
    coordinates: [number, number];
    eventName: string;
    idCategory: string[];
    date: Date;
    idUser: string;
    description: string;
    assistants: string[];
    link: string; //not required
    photo: string;
    idChat: string;
    idComments: string[];
}

export interface IEventModel extends IEvent, Document {}

const EventSchema: Schema = new Schema(
    {
        coordinates: { type: [Number], required: true },
        category: [{ type: Schema.Types.ObjectId, required: true, ref: 'Category' }],
        date: { type: Date, required: true },
        eventName: { type: String, required: true },
        idUser: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        description: { type: String, required: true },
        assistants: [{ type: Schema.Types.ObjectId, required: false, ref: 'User' }],
        link: { type: String, required: false },
        photo: { type: String, required: true },
        idChat: { type: Schema.Types.ObjectId, required: false, ref: 'Chat' },
        idComments: [{ type: Schema.Types.ObjectId, required: false, ref: 'Comment' }]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<IEventModel>('Event', EventSchema);
