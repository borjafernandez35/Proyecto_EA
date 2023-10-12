import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Category from '../models/Category';

const createCategory = (req: Request, res: Response, next: NextFunction) => {
    const { categoryName, idEvents, idUsers } = req.body;

    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        categoryName,
        idEvents,
        idUsers
    });

    return category
        .save()
        .then((category) => res.status(201).json( category ))
        .catch((error) => res.status(500).json({ error }));
};

const readCategory = (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId;

    return Category.findById(categoryId)
        .populate('user', 'event')
        .then((category) => (category ? res.status(200).json( category ) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Category.find()
        .populate('user', 'event')
        .then((categories) => res.status(200).json( categories ))
        .catch((error) => res.status(500).json({ error }));
};

const updateCategory = (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId;

    return Category.findById(categoryId)
        .then((category) => {
            if (category) {
                category.set(req.body);

                return category
                    .save()
                    .then((category) => res.status(201).json( category ))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                return res.status(404).json({ message: 'not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteCategory = (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId;

    return Category.findByIdAndDelete(categoryId)
        .then((category) => (category ? res.status(201).json({ category, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createCategory, readCategory, readAll, updateCategory, deleteCategory };
