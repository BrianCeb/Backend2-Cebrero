import mongoose from 'mongoose';
import { userModel } from './dao/models/userModel.js';

const uri = 'mongodb://127.0.0.1:27017/entrega-final';

const test = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Conectado a MongoDB');

        const user = await userModel.create({
            first_name: 'Test',
            last_name: 'User',
            email: 'test@user.com',
            age: 25,
            password: '123456'
        });

        console.log('Usuario creado:', user);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
    }
};

test();
