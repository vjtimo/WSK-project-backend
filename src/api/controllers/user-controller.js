import {getAllUsers, addUser} from '../models/user-model.js';
import {validationResult} from 'express-validator';
import bcrypt from 'bcrypt';
const getUsers = async (req, res) => {
  res.json(await getAllUsers());
};
const postUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Invalid or missing fields');
    error.status = 400;
    return next(error);
  }
  req.body.salasana = bcrypt.hashSync(req.body.salasana, 10);
  const result = await addUser(req.body);
  if (result.user_id) {
    res.status(201);

    res.json({message: 'New user added.', result});
  } else {
    res.sendStatus(400);
  }
};

export {getUsers, postUser};
