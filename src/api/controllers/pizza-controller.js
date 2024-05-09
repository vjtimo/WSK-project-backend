import {
  getAllPizzas,
  findPizzasById,
  addProduct,
  findAllIngredients,
  findAllCategories,
} from '../models/pizza-model.js';
const getPizza = async (req, res) => {
  res.json(await getAllPizzas());
};
const getProductsById = async (req, res, next) => {
  try {
    const idsParam = req.params.ids;

    if (!idsParam) {
      const error = new Error('Id params missing');
      error.status = 400;
      next(error);
      return;
    }

    const ids = idsParam.split(',').map((id) => parseInt(id.trim()));

    const pizzas = await findPizzasById(...ids);
    if (pizzas.length === 0) {
      const error = new Error('Pizzas not found');
      error.status = 404;
      next(error);
      return;
    }
    res.status(200).json(pizzas);
  } catch (error) {
    next(error);
  }
};
const handleDeleteById = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      const error = new Error('Bad request');
      error.status = 400;
      next(error);
      return;
    }

    const result = await deleteById(id);
    if (!result) {
      return res.status(400).json('asdasdasd');
    }
    res.status(200).json('success');
  } catch (error) {
    console.error('Error fetching pizzas:', error);
    res.status(500).json({error: 'An error occurred while fetching pizzas'});
  }
};

const productPost = async (req, res, next) => {
  try {
    const dish = req.body;
    dish.filename = res.locals.file;
    console.log(dish);
    const result = await addProduct(dish);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
const getAllIngredients = async (req, res) => {
  res.json(await findAllIngredients());
};

const getAllCategories = async (req, res) => {
  res.json(await findAllCategories());
};

export {
  getPizza,
  getProductsById,
  productPost,
  getAllIngredients,
  getAllCategories,
};
