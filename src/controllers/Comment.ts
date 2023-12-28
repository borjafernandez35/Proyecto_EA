import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Comment from '../models/Comment';

const createComment = (req: Request, res: Response, next: NextFunction) => {
    const { userId, text, punctuation, date } = req.body;

    const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        userId,
        text,
        punctuation,
        date
    });

    return comment
        .save()
        .then((comment) => res.status(201).json(comment))
        .catch((error) => res.status(500).json({ error }));
};

const readComment = (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;

    return Comment.findById(commentId)
        .populate('userId')
        .then((comment) => (comment ? res.status(200).json(comment) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Comment.find()
        .populate('userId')
        .then((comments) => res.status(200).json(comments))
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
                    .then((comment) => res.status(201).json(comment))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                return res.status(404).json({ message: 'not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteComment = (req: Request, res: Response, next: NextFunction) => {

    const commentId = req.params.commentId;
    const userIdFromToken = req.userId; // Asegúrate de que este campo se establezca en el middleware de autenticación

    console.log(`Attempting to delete comment with ID: ${commentId} by user: ${userIdFromToken}`);

    Comment.findById(commentId).then((comment) => {
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.userId.toString() !== userIdFromToken) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        return Comment.findByIdAndDelete(commentId)
            .then(() => res.status(200).json({ message: 'Deleted' }))
            .catch((error) => res.status(500).json({ error }));
    });
};

export default { createComment, readComment, readAll, updateComment, deleteComment };
