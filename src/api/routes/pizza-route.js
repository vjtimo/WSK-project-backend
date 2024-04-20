import express from 'express';
import {getPizza, postProduct} from '../controllers/pizza-controller.js';
const pizzaRouter = express.Router();
pizzaRouter.route('/').get(getPizza).post(postProduct);

export default pizzaRouter;
