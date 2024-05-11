import express from 'express';
import cors from 'cors';
import pizzaRouter from './api/routes/pizza-route.js';
import userRouter from './api/routes/user-route.js';
import authRouter from './api/routes/auth-route.js';
import cartRouter from './api/routes/cart-route.js';
import orderRouter from './api/routes/order-route.js';
import restaurantRouter from './api/routes/restaurant-route.js';
import {notFoundHandler, errorHandler} from './middlewares.js';
const app = express();
app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(
  cors({
    credentials: true,
  })
);
app.use('/uploads', express.static('uploads'));
app.use('/api/users', userRouter);
app.use('/api/pizzas', pizzaRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart/', cartRouter);
app.use('/api/restaurant', restaurantRouter);
app.use('/api/order', orderRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
