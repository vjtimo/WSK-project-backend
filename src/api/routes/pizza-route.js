/* eslint-disable new-cap */
import express from 'express';
import {getPizza, getProductsById} from '../controllers/pizza-controller.js';
const pizzaRouter = express.Router();
pizzaRouter.route('/').get(getPizza);
pizzaRouter.route('/:ids').get(getProductsById);
export default pizzaRouter;
