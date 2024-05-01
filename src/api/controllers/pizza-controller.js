import {getAllPizzas, findPizzasById} from '../models/pizza-model.js';
const getPizza = async (req, res) => {
  res.json(await getAllPizzas());
};
const getProductsById = async (req, res) => {
  try {
    const idsParam = req.params.ids;

    if (!idsParam) {
      return res.status(400).json({error: 'No pizza IDs provided'});
    }

    const ids = idsParam.split(',').map((id) => parseInt(id.trim()));

    const pizzas = await findPizzasById(...ids);

    res.status(200).json(pizzas);
  } catch (error) {
    console.error('Error fetching pizzas:', error);
    res.status(500).json({error: 'An error occurred while fetching pizzas'});
  }
};
export {getPizza, getProductsById};
