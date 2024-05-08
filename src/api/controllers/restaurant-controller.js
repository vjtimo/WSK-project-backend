import {findRestaurants} from '../models/restaurant-model.js';

const getRestaurants = async (req, res, next) => {
  try {
    const result = await findRestaurants();
    if (result.length === 0) {
      const error = new Error('No pizzas found');
      error.status = 404;
      next(error);
      return;
    }
    res.json(result);
  } catch (e) {
    next(e);
  }
};

export {getRestaurants};
