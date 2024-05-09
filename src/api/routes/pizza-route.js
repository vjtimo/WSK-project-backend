import express from 'express';
import {
  getPizza,
  getProductsById,
  productPost,
} from '../controllers/pizza-controller.js';
const pizzaRouter = express.Router();
import {body} from 'express-validator';
import {validationErrors, getAiImage, saveAiImage} from '../../middlewares.js';
pizzaRouter
  .route('/')
  .get(getPizza)
  .post(
    body('name').notEmpty().escape(),
    body('description').notEmpty().escape(),
    body('category_name').notEmpty().escape(),
    body('ingredient_names').isArray({min: 1}),
    validationErrors,
    getAiImage,
    saveAiImage,
    productPost
  );
pizzaRouter.route('/:ids').get(getProductsById);
export default pizzaRouter;
