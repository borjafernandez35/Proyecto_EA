import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory {
    categoryName: string;
    idEvents: string[];
    idUsers: string[];
}

export interface ICategoryModel extends ICategory, Document {}

const CategorySchema: Schema = new Schema(
    {
        categoryName: { type: String, required: true },
        idEvents: { type: Schema.Types.ObjectId, required: true },
        idUsers: { type: Schema.Types.ObjectId, required: true }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export default mongoose.model<ICategoryModel>('Category', CategorySchema);
