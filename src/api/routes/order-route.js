/* eslint-disable new-cap */
import express from 'express';
import {getCart} from '../controllers/order-controller.js';
const orderRouter = express.Router();

orderRouter.route('/:id').get(getCart);

export default orderRouter;
