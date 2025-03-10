import { IUserDTO } from './userDTO.mts';

export interface APIResponse {
    status: number,
    message: string,
    users?: IUserDTO[]
}