import {getAllPizzas} from '../models/pizza-model.js';
const getPizza = async (req, res) => {
  res.json(await getAllPizzas());
};

const postProduct = async (req, res) => {
  const result = await createProduct(req.body);
  if (result.error) {
    res.status(400).json(result);
  } else {
    res.json(result);
  }
  res.status(201)
  res.json({message: 'Product created', result});

  res.json(await createProduct(req.body));
};

export {getPizza, postProduct};
