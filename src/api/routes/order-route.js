import {postOrder} from '../controllers/order-controller.js';
import express from 'express';

const orderRouter = express.Router();

orderRouter.route('/').post(postOrder);

export default orderRouter;
