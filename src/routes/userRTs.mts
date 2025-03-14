import { Router, Request, Response }  from 'express';
import { IUser } from '../models/users/IUser.mts';
import userCTRL from '../controllers/userCTRL.mts';
import { IUserDTO } from '../models/users/userDTO.mts';

export const userRouter = Router();

const formats = (() => {
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
    }, eBURL = 'http://localhost';

    return {
        id: {
            type: 'string',
            required: true
        },
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
                required: 'false unless q is present.',
                possibleValues: ['name', 'street', 'zip', 'city']
            },
            q: {
                type: 'string || number',
                required: 'false unless p is present.'
            },
            exampel: `${eBURL}/users?p=name&q=smith`
        },
        sort: {
            type: 'string',
            required: false,
            possibleValues: ['asc', 'desc'],
            default: 'asc',
            example: `${eBURL}/users?s=desc`
        }
    };
})(), getReqURL = (req: Request) => `${req.protocol}://${req.headers.host + req.baseUrl}/`,
    genErrorObj = (message: string, receivedData?: object, format?: object) => ({ status: 0, message, format, receivedData }),
    retFunc = (res: Response, sts: typeof res.statusCode, retObj: object) => { res.status(sts).json(retObj) },
    inputFault = (res: Response, msg: string, inpData: object, optParams?: { format?: object, sts?: typeof res.statusCode }) => {
        retFunc(res, optParams?.sts ?? 449, genErrorObj(msg, inpData, optParams?.format));
    }, retErr = (res: Response, retObj: object) => { retFunc(res, 500, retObj) };

userRouter.post('/', async (req, res) => {
    try {
        const { name, address, profession, bio }: IUser = req.body, email: string = req.body.email;

        if (!name || !email  || !address || !address.street || !address.zip || !address.city) return inputFault(
            res,
            `User data must follow correct formatting specified in the format property of this object.`,
            req.body,
            { format: formats.user }
        );

        const ctrlResponse = await userCTRL.createUser({ name, address, profession, bio } satisfies IUser, email);

        return retFunc(res, !ctrlResponse.status ? 400 : 200, ctrlResponse);
    } catch (error) {
        return retErr(res, genErrorObj(error instanceof Error ? error.message : `${error}`, req.body));
    }
});

userRouter.get('/:id?' as string, async (req, res) => {
    try {
        const { id } = req.params, { p, q, s } = req.query;
        
        if ((!p && q) || (p && !q)) return inputFault(
            res,
            `Both query parameters p and q must be present if one is present.`,
            req.query,
            { format: formats.search }
        );
        
        if (s && !['asc', 'desc'].includes(s.toString())) inputFault(
            res,
            `Query parameter s can only have the values asc or desc. If omitted the default value is asc.`,
            req.query,
            { format: formats.sort }
        )

        const ctrlResponse = await userCTRL.getUser(id, s?.toString() , { param: p?.toString() , value: typeof q !== 'number' ? q?.toString() : parseInt(q) });

        return retFunc(res, !ctrlResponse.status ? 404 : 200, ctrlResponse);
    } catch (error) {
       return retErr(res, genErrorObj(error instanceof Error ? error.message : `${error}`, req.body));
    }
});

userRouter.put('/:id?', async (req, res) => {
    try {
        const { id } = req.params, { name, address, profession, bio }: IUser = req.body, email: string = req.body.email;

        if (!id) return inputFault(
            res,
            `User id must be present in the URL.`,
            { url: `${req.protocol}://${req.headers.host + req.baseUrl}/${id}` }, 
            { format: { ...formats.id, example: `${getReqURL(req)}/<UUID>` } }
        );

        if (!name && !email  && (!address || (!address.street && !address.zip && !address.city))) return inputFault(
            res,
            `User data must follow correct formatting specified in the format property of this object.`,
            req.body,
            { format: formats.user }
        );

        const ctrlResponse = await userCTRL.updateUser({id, name, address, profession, bio } satisfies IUserDTO, email);

        return retFunc(res, !ctrlResponse.status ? 400 : 200, ctrlResponse);
    } catch (error) {
        return retErr(res, genErrorObj(error instanceof Error ? error.message : `${error}`, req.body));
    }
});

userRouter.delete('/:id?', async (req, res) => {
    try {
        const { id } = req.params, { name, address, profession, bio }: IUser = req.body, email: string = req.body.email,
            URL = `${getReqURL(req)}/`;

        if (!id) return inputFault(
            res,
            `User id must be present in the URL.`,
            { url: URL + id }, 
            { format: { ...formats.id, example: `${URL}<UUID>` } }
        );

        const ctrlResponse = await userCTRL.deleteUser(id);

        return retFunc(res, !ctrlResponse.status ? 400 : 200, ctrlResponse);
    }catch (error) {
        return retErr(res, genErrorObj(error instanceof Error ? error.message : `${error}`, req.body));
    }
});