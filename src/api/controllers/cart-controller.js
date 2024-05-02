import {
  getCartById,
  createNewCart,
  checkCart,
  addToCart,
} from '../models/cart-model.js';

const getCart = async (req, res) => {
  try {
    const cartId = await checkCart(req.params.id);

    if (!cartId) {
      const newCart = await createNewCart(req.params.id);
      if (!newCart) {
        return res
          .status(500)
          .json({success: false, message: 'Failed to create a new cart'});
      }
      console.log(newCart);
      return res.status(201).json({id: newCart, STORED_ORDERS: []});
    }
    const result = await getCartById(cartId);
    res.json({id: cartId, STORED_ORDERS: result});
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
};

const addItems = async (req, res) => {
  const cartId = req.body.cart_id;
  const items = req.body.items;
  try {
    const result = await addToCart(cartId, items);
    if (!result || result.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to add items to the cart. No rows affected.',
      });
    }
    return res
      .status(200)
      .json({success: true, message: 'Items successfully added'});
  } catch (e) {
    res
      .status(500)
      .json({success: false, message: 'Failed tasdadado add items'});
  }
};
export {getCart, addItems};
