import { Router, Response }  from 'express';
import { IUser } from '../models/users/IUser.mts';
import userCTRL from '../controllers/userCTRL.mts';

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
        },
        search: {
            p: {
                type: 'string',
                required: 'false unless s is present.',
                possibleValues: ['name', 'street', 'zip', 'city']
            },
            s: {
                type: 'string || number',
                required: 'false unless p is present.'
            },
            exampel: 'http://localhost/users?p=name&s=smith'
        }
    };
})(), genErrorObj = (message: string, receivedData?: object, format?: object) => ({ status: 0, message, format, receivedData }),
    inputFault = (res: Response, msg: string, inpData: object, optParams?: { format?: object, sts?: typeof res.statusCode }) => {
        res.status(optParams?.sts ?? 449).json(genErrorObj(msg, inpData, optParams?.format));
    };

userRouter.post('/', async (req, res) => {
    try {
        const { name, address, profession, bio }: IUser = req.body, email: string = req.body.email;

        if (name || !email  || !address || !address.street || !address.zip || !address.city) return inputFault(
            res,
            `User data must follow correct formatting specified in the format property of this object.`,
            req.body,
            { format: foramts.user }
        );

        const ctrlResponse = await userCTRL.createUser({ name, address, profession, bio }, email);

        res.status(!ctrlResponse.status ? 400 : 201).json(ctrlResponse);
    } catch (error) {
        res.status(500).json(genErrorObj(error instanceof Error ? error.message : `${error}`, req.body));
    }
});

userRouter.get('/:id?' as string, async (req, res) => {
    try {
        const { id } = req.params, { p, s } = req.query;
        
        if ((!p && s) ||(p && !s)) return inputFault(
            res,
            `Both query parameters p and s must be present if one is present.`,
            req.query,
            { format: foramts.search }
        );

        const ctrlResponse = await userCTRL.getUser(id, { param: p as string, value: s as number | string });

        res.status(!ctrlResponse.status ? 404 : 200).json(ctrlResponse);
    } catch (error) {
        res.status(500).json(genErrorObj(error instanceof Error ? error.message : `${error}`, req.params));
    }
});