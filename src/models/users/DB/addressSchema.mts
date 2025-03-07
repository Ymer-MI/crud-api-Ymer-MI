import { Schema } from 'mongoose';

export const addressSchema = new Schema({
    street: {
        type: String,
        required: true
    },
    zip: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    }
});