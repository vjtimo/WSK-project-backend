import {getCartById, createNewCart, checkCart} from '../models/order-model.js';

const getCart = async (req, res) => {
  try {
    let cartId = await checkCart(req.params.id);

    if (!cartId) {
      const newCart = await createNewCart(req.params.id);
      if (!newCart) {
        return res
          .status(500)
          .json({success: false, message: 'Failed to create a new cart'});
      }
      const result = newCart;
      return res
        .status(201)
        .json({success: true, message: 'New cart created', data: result});
    }
    const result = await getCartById(cartId);

    res.json(result);
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
};
export {getCart};
