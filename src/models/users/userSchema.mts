import { model, Schema } from 'mongoose';
import { addressSchema } from './addressSchema.mts';

const userSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: addressSchema,
        required: true
    },
    profession: String,
    bio: String
}), User = model('User', userSchema);

export default User;