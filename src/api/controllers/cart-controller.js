import {
  getCartById,
  createNewCart,
  checkCart,
  addToCart,
} from '../models/cart-model.js';

//gets cart id by  user id, if the checkCart doesnt find cart by user id then it creates a new empty cart and returns it
const getCart = async (req, res, next) => {
  try {
    const cartId = await checkCart(req.params.id); //params contains the user_id

    if (!cartId) {
      const newCart = await createNewCart(req.params.id); //creates a new cart and assigns it to the user_id
      if (!newCart) {
        const error = new Error('Couldnt create  a new cart');
        error.status = 500;
        next(error);
        return;
      }
      return res.status(201).json({id: newCart, STORED_ORDERS: []}); //returns the carts id and empty list(the list is kinda unneseccary)
    }
    const result = await getCartById(cartId);
    res.json({id: cartId, STORED_ORDERS: result}); //returns cart_id and a list that contains the product ids+quantitys.
  } catch (e) {
    next(e);
  }
};

const addItems = async (req, res, next) => {
  const cartId = req.body.cart_id;
  const items = req.body.items;
  try {
    const result = await addToCart(cartId, items);
    if (!result || result.affectedRows === 0) {
      const error = new Error('Something went wrong when trying to add items');
      error.status = 500;
      next(error);
      return;
    }
    return res
      .status(200)
      .json({success: true, message: 'Items successfully added'});
  } catch (e) {
    next(e);
  }
};

export {getCart, addItems};
