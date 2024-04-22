import express from 'express';
import cors from 'cors';
import pizzaRouter from './api/routes/pizza-route.js';
import userRouter from './api/routes/user-route.js';
import {notFoundHandler, errorHandler} from './middlewares.js';
const app = express();
app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/api/users', userRouter);
app.use('/api/pizzas', pizzaRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
