import { APIResponse } from '../models/APIResponse.mts';
import serviceBase from './serviceBase.mts';

const BASE_URL = 'http://localhost', CAPIService = {
    async getUsers (search?: { p: string, q: string | number }) {
        return (await serviceBase.get<APIResponse>(`${BASE_URL}/users${!search || !search.q ? '' : `?p=${search.p}&q=${search.q}`}`)).users ?? [];
    }
};

export default CAPIService;