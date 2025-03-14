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
    checkIndexOf = (txt: string | number, subTxt: string | number | undefined) => !subTxt ? false : txt.toString().toLowerCase().includes(subTxt.toString().toLowerCase()), userCTRL = {
        async createUser(user: IUser, email: string) {
            try {
                const userObj = {...user, email }, userDB = await User.create({ id: uuid(), ...userObj} satisfies userDBType);
        
                if (!userDB) return genRetObj(`Could not create user from data: ${userObj}`);
        
                return genRetObj(`User "${userDB.name}" has been created successfully.`, [convertToUserDTO(userDB)]);  
            } catch (error) {
                throw error;
            }
        },
        async getUser(id?: string, sort: string = 'asc', search?: { param?: string, value?: string | number }) {
            try {
                if (!id) {
                    const users = await User.find().sort({ name : sort === 'asc' ? 1 : -1 });

                    if (!users) return genRetObj(`No users found.`);

                    if (search?.value || !search?.param) return genRetObj(`Found ${users.length} users.`, users.map(convertToUserDTO));

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

                const user = await User.findOne({ id });

                if (!user) return genRetObj(`No user found with id: ${id}`);

                return genRetObj(`User ${user.name} was found.`, [convertToUserDTO(user)]);
            } catch (error) {
                throw error;
            }
        },
        async updateUser(user: IUserDTO, email: string) {
            try {
                const userDB = await User.findOne({ id: user.id });

                if (!userDB) return genRetObj(`No user found with id: ${user.id}`);

                Object.assign(userDB, {
                    id: userDB.id,
                    name: user.name ?? userDB.name,
                    email: email ?? userDB.email,
                    address: {
                        street: user.address?.street ?? userDB.address.street,
                        zip: user.address?.zip ?? userDB.address.zip,
                        city: user.address?.city ?? userDB.address.city
                    },
                    profession: user.profession ?? userDB.profession,
                    bio: user.bio ?? userDB.bio
                } satisfies userDBType);

                await userDB.save();

                return genRetObj(`User ${userDB.name} has been updated.`, [convertToUserDTO(userDB)]);
            } catch (error) {
                throw error;
            }
        },
        async deleteUser(id: string) {
            try {
                const userDB = await User.findOneAndDelete({ id });

                if (!userDB) return genRetObj(`No user found with id: ${id}`);

                return genRetObj(`User ${userDB.name} has been deleted.`, [convertToUserDTO(userDB)]);
            } catch (error) {
                throw error;
            }
        }
    };

export default userCTRL;