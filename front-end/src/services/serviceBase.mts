import axios from 'axios';

const serviceBase = {
    async get<T>(url: string) {
        return (await axios.get<T>(url)).data;
    }
};

export default serviceBase;