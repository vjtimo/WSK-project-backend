import {addUser, getUserByName} from '../models/user-model.js';
import {validationResult} from 'express-validator';
import bcrypt from 'bcrypt';

const postUser = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid or missing fields');
    error.status = 400;
    return next(error);
  }
  const isUser = await getUserByName(req.body.tunnus);
  if (isUser) {
    const error = new Error('Username already exists');
    error.status = 409;
    return next(error);
  }
  req.body.salasana = bcrypt.hashSync(req.body.salasana, 10);
  const result = await addUser(req.body);
  if (result.user_id) {
    res.status(201);

    res.json({message: 'New user added.', result});
  } else {
    const error = new Error('Bad request');
    error.status = 400;
    next(error);
    return;
  }
};

export {postUser};
