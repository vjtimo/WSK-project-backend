import express from 'express';
import cors from 'cors';
import pizzaRouter from './api/routes/pizza-route.js';

const app = express();
app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/api/pizzas', pizzaRouter);

export default app;
