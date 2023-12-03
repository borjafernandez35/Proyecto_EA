import mongoose, { Document, Schema } from 'mongoose';

export interface IComment {
    userId: string;
    date: Date;
    text: string;
    punctuation: number; //valorar de 1 a 5, estrellitas.
}

export interface ICommentModel extends IComment, Document {}

const CommentSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        //avatar: { type: String, required: true },
        text: { type: String, required: true },
        punctuation: { type: Number, required: false },
        date: { type: Date, required: true }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export default mongoose.model<ICommentModel>('Comment', CommentSchema);
