import express from 'express';
import {
  getPizza,
  getProductsById,
  productPost,
  getAllIngredients,
  getAllCategories,
  handleDeleteById,
  getPopular,
} from '../controllers/pizza-controller.js';
const pizzaRouter = express.Router();
pizzaRouter.route('/popular').get(getPopular);
import {body} from 'express-validator';
import {
  validationErrors,
  getAiImage,
  saveAiImage,
  authenticateToken,
} from '../../middlewares.js';
pizzaRouter
  .route('/')
  .get(getPizza)
  .post(
    authenticateToken,
    body('name').notEmpty().escape(),
    body('description').notEmpty().escape(),
    body('category_name').notEmpty().escape(),
    validationErrors,
    getAiImage,
    saveAiImage,
    productPost
  );

pizzaRouter.route('/ingredients').get(getAllIngredients);
pizzaRouter.route('/categories').get(getAllCategories);
pizzaRouter.route('/delete/:id').patch(handleDeleteById);
pizzaRouter.route('/:ids').get(getProductsById);

export default pizzaRouter;
