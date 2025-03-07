import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { userRouter } from './routes/userRTs.mts';

dotenv.config();

const DB_URL = process.env.MONGODB_URL, PORT = process.env.PORT || 3000, app = express().use(express.json()), STS_MSG = `Server running @http://localhost:${PORT}`;

if (!DB_URL) throw Error('MONGODB_URL is not defined in .env file.');

app.get('/ping', (_, res) => {
    res.status(200).json({ status: 1, message: STS_MSG})
});

app.use('/users', userRouter);

app.listen(PORT, async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(DB_URL);
        console.log(STS_MSG)
    } catch (error) {
        console.error(`Error connecting to database:\n${error}`);
    }
});