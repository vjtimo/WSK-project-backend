import {
  postOrder,
  getOrders,
  setStatus,
  getById,
} from '../controllers/order-controller.js';
import express from 'express';

const orderRouter = express.Router();

orderRouter.route('/').get(getOrders).post(postOrder);
orderRouter.route('/:id').get(getById);
orderRouter.route('/status').patch(setStatus);
export default orderRouter;
