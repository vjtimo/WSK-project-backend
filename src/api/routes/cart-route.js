/* eslint-disable new-cap */
import express from 'express';
import {getCart, addItems} from '../controllers/cart-controller.js';
const cartRouter = express.Router();

cartRouter.route('/:id').get(getCart);
cartRouter.route('/').post(addItems);

export default cartRouter;
