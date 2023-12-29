import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import IJwtPayload from '../models/JWTPayload';
import { config } from '../config/config';

// Función para validar la fortaleza de la contraseña
export const validatePasswordStrength = (password: string) => {
    if (password.length < 8) {
        return 400;
    }

    if (!/[A-Z]/.test(password)) {
        return 400;
    }

    if (!/[a-z]/.test(password)) {
        return 400;
    }

    if (!/\d/.test(password)) {
        return 400;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 400;
    }

    return null;
};

const _SECRET: string = 'api+jwt';

interface AuthenticatedRequest extends Request {
    idUser?: string;
}

export async function signin(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    console.log(email, password);

    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).send('El email no existe');
    }

    const validPassword = await user.validatePassword(password);

    if (!validPassword) {
        return res.status(401).json({ auth: false, token: null });
    }

    const token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 60 * 60 * 24
    });

    return res.status(200).json({ auth: true, token, user });
}

export async function signup(req: Request, res: Response): Promise<Response> {
    const { userName, email, password, role, birthDate, avatar, createdEventsId, joinedEventsId, idCategories, description } = req.body;
    console.log(userName, email, password);

    try {
        // Verificar la robustez de la contraseña antes de crear el usuario
        const passwordStrengthError = validatePasswordStrength(password);
        if (passwordStrengthError == 400) {
            return res
                .status(400)
                .send(
                    'Bad password. A robust one must meet specific criteria, including a minimum length of 8 characters, the inclusion of uppercase and lowercase letters, numeric digits, and at least one special character from this predefined set: !/[!@#$%^&*(),.?":{}|<>]/'
                );
        }

        const existeEmail = await User.findOne({ email });
        const existeUserName = await User.findOne({ userName });

        if (existeEmail) {
            return res.status(404).send('This email is already used');
        } else if (existeUserName) {
            return res.status(405).send('This user name is already used');
        } else {
            const user = new User({
                userName,
                email,
                password,
                role,
                birthDate,
                avatar,
                createdEventsId,
                joinedEventsId,
                idCategories,
                description
            });

            user.password = await user.encryptPassword(user.password);

            await user.save();

            // Ahora, después de registrarse, generamos un token y lo devolvemos
            const token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 60 * 60 * 24
            });

            return res.status(200).json({ auth: true, token, user });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function priv(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
        const user = await User.findById(req.idUser);

        if (!user) {
            return res.status(404).json({ error: 'No se encontró el usuario' });
        } else if (user.role == 'admin') {
            res.json('Your role is: ' + user.role + '  ' + user.userName.toUpperCase() + ':  Welcome to the admin section!!! ');
        } else {
            return res.status(404).send('You are not an admin');
        }

        const { password, ...userWithoutPassword } = user.toObject();
        return res.json({ user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export async function publ(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
        const user = await User.findById(req.idUser, { password: 0 });

        if (!user) {
            return res.status(404).send('No user found');
        }
        res.json('you are in the public section: ' + user.userName);

        const { password, ...userWithoutPassword } = user.toObject();
        return res.json({ user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export async function me(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
        return res.json('me');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}
