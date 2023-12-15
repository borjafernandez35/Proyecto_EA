import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ICategory } from './Category';

export interface IEvent {
    coordinates: {
        type: String,
        coordinates: [number, number];
    };
    eventName: string;
    idCategory: ICategory;
    date: Date;
    idUser: IUser;
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
        coordinates: {
            type: {
                type: String,
                enum: ['Point'], //'location.type' ha de ser 'Point'
                required: true
            },
            coordinates: {
                type: [Number], //array de numeros - [x, y]
                required: true
            }
        },
        idCategory: [{ type: Schema.Types.ObjectId, required: false, ref: 'Category' }],
        date: { type: Date, required: true },
        eventName: { type: String, required: true },
        idUser: { type: Schema.Types.ObjectId, required: false, ref: 'User' },
        description: { type: String, required: true },
        assistants: [{ type: String, required: false, ref: 'User' }],
        link: { type: String, required: false },
        photo: { type: String, required: false },
        idChat: { type: String, required: false, ref: 'Chat' },
        idComments: [{ type: String, required: false, ref: 'Comment' }]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<IEventModel>('Event', EventSchema);