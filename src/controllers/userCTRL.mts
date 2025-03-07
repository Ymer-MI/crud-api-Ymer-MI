import { InferSchemaType } from 'mongoose';
import User from '../models/users/userSchema.mts';
import { IUser } from '../models/users/IUser.mts';
import { IUserDTO } from '../models/users/userDTO.mts';
import { v4 as uuid } from 'uuid';

type userDB = InferSchemaType<typeof User.schema>;

const convertToUserDTO = (user: userDB) => ({
        id: user.id,
        name: user.name,
        address: {
            street: user.address.street,
            zip: user.address.zip,
            city: user.address.city
        },
        profession: user.profession || undefined,
        bio: user.bio || undefined
    } satisfies IUserDTO as IUserDTO);

export const createUser = async (user: IUser, email: string) => {
    try {
        const userObj = {...user, email }, userDB = await User.create({ id: uuid(), ...userObj});

        if (!userDB) return { status: 0, message: `Could not create user from data: ${userObj}`};

        return { status: 1, message: `User "${userDB.name}" has been created successfully.`, user: convertToUserDTO(userDB)};  
    } catch (error) {
        throw error;
    }
};