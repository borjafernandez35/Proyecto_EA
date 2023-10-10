import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Comment from '../models/Comment';

const createComment = (req: Request, res: Response, next: NextFunction) => {
    const { userId, text, punctuation } = req.body;

    const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        userId,
        text,
        punctuation
    });

    return comment
        .save()
        .then((comment) => res.status(201).json({ comment }))
        .catch((error) => res.status(500).json({ error }));
};

const readComment = (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;

    return Comment.findById(commentId)
        .populate('user')
        .then((event) => (event ? res.status(200).json({ event }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Comment.find()
        .populate('user')
        .then((comments) => res.status(200).json({ comments }))
        .catch((error) => res.status(500).json({ error }));
};

const updateComment = (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;

    return Comment.findById(commentId)
        .then((comment) => {
            if (comment) {
                comment.set(req.body);

                return comment
                    .save()
                    .then((comment) => res.status(201).json({ comment }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                return res.status(404).json({ message: 'not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteComment = (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;

    return Comment.findByIdAndDelete(commentId)
        .then((comment) => (comment ? res.status(201).json({ comment, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createComment, readComment, readAll, updateComment, deleteComment };
