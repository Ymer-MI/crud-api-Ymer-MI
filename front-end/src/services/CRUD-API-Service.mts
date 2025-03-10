import { APIResponse } from '../models/APIResponse.mts';
import serviceBase from './serviceBase.mts';

const BASE_URL = 'http://localhost', CAPIService = {
    async getUsers () {
        return (await serviceBase.get<APIResponse>(`${BASE_URL}/users`)).users;
    }
};

export default CAPIService;