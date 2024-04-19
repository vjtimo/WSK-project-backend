import {getAllPizzas} from '../models/pizza-model.js';
const getPizza = async (req, res) => {
  res.json(await getAllPizzas());
};
export {getPizza};
