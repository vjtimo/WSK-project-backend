import {addOrder} from '../models/order-model.js';

const postOrder = async (req, res) => {
  console.log(req.body);
  const ravintola = req.body.ravintola;
  const ostosId = req.body.ostoskori;
  try {
    const result = await addOrder(ravintola, ostosId);
    if (!result || result.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to make a new order.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Order succesfully placed',
      cartId: result.insertId,
    });
  } catch (e) {
    res
      .status(500)
      .json({success: false, message: 'Failed to make a new order'});
  }
};
export {postOrder};
