/* eslint-disable new-cap */
import express from 'express';
import {body} from 'express-validator';
import {validationErrors} from '../../middlewares.js';
import {postUser} from '../controllers/user-controller.js';
const userRouter = express.Router();

userRouter
  .route('/register')
  .post(
    body('tunnus').trim().isLength({min: 4, max: 20}),
    body('salasana').trim().isLength({min: 4, max: 30}),
    validationErrors,
    postUser
  );
export default userRouter;
