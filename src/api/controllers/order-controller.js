import {
  addOrder,
  findOrders,
  updateStatus,
  findOrderById,
} from '../models/order-model.js';

const postOrder = async (req, res) => {
  const ravintola = req.body.ravintola;
  const ostosId = req.body.ostoskori;

  const result = await addOrder(ravintola, ostosId);
  if (!result || result.affectedRows === 0) {
    res.sendStatus(500);
  }
  res.status(200).json({
    success: true,
    message: 'Order succesfully placed',
    cartId: result.insertId,
  });
};

const getOrders = async (req, res, next) => {
  try {
    const result = await findOrders();
    if (!result) {
      const error = new Error('Orders not found');
      error.status = 404;
      next(error);
      return;
    }
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};
const setStatus = async (req, res, next) => {
  try {
    const result = await updateStatus(req.body.id, req.body.status);
    if (!result) {
      const error = new Error('Status was not updated');
      error.status = 500;
      next(error);
      return;
    }
    res.status(200).json('Order status updated');
  } catch (e) {
    next(e);
  }
};
const getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await findOrderById(id);
    console.log(result);
    if (result.length === 0) {
      const error = new Error('Order not found');
      error.status = 404;
      next(error);
      return;
    }
    return res.status(200).json(result);
  } catch (e) {
    res.sendStatus(500);
  }
};
export {postOrder, getOrders, setStatus, getById};
