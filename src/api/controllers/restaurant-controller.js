import {findRestaurants} from '../models/restaurant-model.js';

const getRestaurants = async (req, res) => {
  res.json(await findRestaurants());
};

export {getRestaurants};
