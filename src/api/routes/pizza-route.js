import express from 'express';
import {getPizza} from '../controllers/pizza-controller.js';
const pizzaRouter = express.Router();
pizzaRouter.route('/').get(getPizza);

export default pizzaRouter;
