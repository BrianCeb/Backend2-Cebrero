import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import sessionRouter from './routes/sessionsRouter.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import __dirname from './utils/constantsUtil.js';
import websocket from './websocket.js';

const app = express();

// Conexión a MongoDB
const uri = 'mongodb://127.0.0.1:27017/entrega-final';
mongoose.connect(uri);

// Middlewares y Passport
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
initializePassport();
app.use(passport.initialize());

// Rutas
app.use('/api/sessions', sessionRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

// Handlebars Config
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

// Servidor y WebSocket
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Start server in PORT ${PORT}`);
});

const io = new Server(httpServer);
websocket(io);
