import {
  addOrder,
  findOrders,
  updateStatus,
  findOrderById,
} from '../models/order-model.js';

const postOrder = async (req, res) => {
  console.log(req.body);
  const ravintola = req.body.ravintola;
  const ostosId = req.body.ostoskori;
  try {
    const result = await addOrder(ravintola, ostosId);
    if (!result || result.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        message: 'test.',
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

const getOrders = async (req, res) => {
  try {
    const result = await findOrders();
    if (!result) {
      return res.status(400).message('Orders not found');
    }
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json.message('Internal server error');
  }
};
const setStatus = async (req, res) => {
  console.log('TEEEST');
  try {
    const result = await updateStatus(req.body.id, req.body.status);
    if (!result) {
      res.status(500).json({
        success: false,
        message: 'Failed to make a new order.',
      });
    }
    res.status(200).json('Order status updated');
  } catch (e) {
    res.json(e.message);
  }
};
const getById = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const result = await findOrderById(id);
    if (!result) {
      return res.status(400).message('Orders not found');
    }
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json('Internal server error');
  }
};
export {postOrder, getOrders, setStatus, getById};
