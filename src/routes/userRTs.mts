import { Router } from 'express';
import { IUser } from '../models/users/IUser.mts';
import { createUser } from '../controllers/userCTRL.mts';

export const userRouter = Router();

const foramts = (() => {
    const address = {
        street: {
            type: 'string',
            required: true
        },
        zip: {
            type: 'number',
            required: true},
        city: {
            type: 'string',
            required: true
        }
    };

    return {
        address,
        user: {
            name: {
                type: 'string',
                required: true
            },
            email: {
                type: 'string',
                required: true
            },
            address: address,
            profession: {
                type: 'string',
                required: false
            },
            bio: {
                type: 'string',
                required: false
            }
        }
    };
})(), genErrorObj = (message: string, receivedData?: object, format?: object) => ({ status: 0, message, format, receivedData });

userRouter.post('/', async (req, res) => {
    try {
        const { name, address, profession, bio }: IUser = req.body, email: string = req.body.email;

        if (!name || !email  || !address || !address.street || !address.zip || !address.city) return (() => { res.status(400).json(genErrorObj(`User data must follow correct formatting specified in the format property of this object.`, req.body, foramts.user)) })();

        const ctrlResponse = await createUser({ name, address, profession, bio }, email);

        res.status(!ctrlResponse.status ? 400 : 201).json(ctrlResponse);
    } catch (error) {
        res.status(500).json(genErrorObj(error instanceof Error ? error.message : `${error}`, req.body));
    }
});