import { InferSchemaType } from 'mongoose';
import User from '../models/users/DB/userSchema.mts';
import { IUser } from '../models/users/IUser.mts';
import { IUserDTO } from '../models/users/userDTO.mts';
import { v4 as uuid } from 'uuid';

type userDBType = InferSchemaType<typeof User.schema>;

const convertToUserDTO = (user: userDBType) => ({
        id: user.id,
        name: user.name,
        address: {
            street: user.address.street,
            zip: user.address.zip,
            city: user.address.city
        },
        profession: user.profession || undefined,
        bio: user.bio || undefined
    } satisfies IUserDTO as IUserDTO), genRetObj = (message: string, users?: IUserDTO[]) => ({ status: !users ? 0 : 1, message, users: users ?? [] }),
    checkIndexOf = (txt: string | number, subTxt: string | number) => !txt.toString().toLowerCase().indexOf(subTxt.toString().toLowerCase()), userCTRL = {
        async createUser(user: IUser, email: string) {
            try {
                const userObj = {...user, email }, userDB = await User.create({ id: uuid(), ...userObj} satisfies userDBType) as userDBType;
        
                if (!userDB) return genRetObj(`Could not create user from data: ${userObj}`);
        
                return genRetObj(`User "${userDB.name}" has been created successfully.`, [convertToUserDTO(userDB)]);  
            } catch (error) {
                throw error;
            }
        },
        async getUser(id?: string, search?: { param: string, value: string | number }) {
            try {
                if (!id) {
                    const users = await User.find() as userDBType[];

                    if (!users) return genRetObj(`No users found.`);

                    if (!search?.param || !search?.value) return genRetObj(`Found ${users.length} users.`, users.map(convertToUserDTO));

                    const usersFiltered = users.filter(user => {
                        switch (search.param) {
                            case 'name':
                                return checkIndexOf(user.name, search.value);
                            case 'street':
                                return checkIndexOf(user.address.street, search.value);
                            case 'zip':
                                return checkIndexOf(user.address.zip, search.value);
                            case 'city':
                                return checkIndexOf(user.address.city, search.value);
                            default:
                                return false;
                        }
                    });

                    if (!usersFiltered) return genRetObj(`No users found that match criteria ${search.param} = ${search.value}.`);

                    return genRetObj(`Found ${usersFiltered.length} users with ${search.param} = ${search.value}.`, usersFiltered.map(convertToUserDTO));
                }

                const user = await User.findOne({ id }) as userDBType;

                if (!user) return genRetObj(`No user found with id: ${id}`);

                return genRetObj(`User ${user.name} was found.`, [convertToUserDTO(user)]);
            } catch (error) {
                throw error;
            }
        }
    };

export default userCTRL;