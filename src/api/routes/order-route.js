/* eslint-disable new-cap */
import express from 'express';

const orderRouter = express.Router();
orderRouter.route('/addCart').post(postCart);

export default orderRouter;
