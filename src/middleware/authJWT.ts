import { Request, Response, NextFunction } from 'express'
import jwt from "jsonwebtoken";

import User from "../models/User";
import IJwtPayload from '../models/JWTPayload';

const _SECRET: string = 'api+jwt';




export async function verifyToken (req: Request, res: Response, next: NextFunction) {
    console.log("verifyToken");
    
    const token = req.header("x-access-token");
    if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    
    const decoded = jwt.verify(token, _SECRET) as IJwtPayload;
    console.log("verifyToken");
   // req.userId = decoded.id; 
    const user = await User.findById(req.userId, { password: 0 });
    console.log(user);
    if (!user) return res.status(404).json({ message: "No user found" });

    
    next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export async function isOwner (req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.userId);

    next();

  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error });
  }
};

