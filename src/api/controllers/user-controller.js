import {addUser, getUserByName, findUserInfo} from '../models/user-model.js';
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
  console.log(result);
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
const getUserInfo = async (req, res, next) => {
  try {
    const result = await findUserInfo(req.params.id);
    if (!result) {
      const error = new Error('User not found');
      error.status = 404;
      next(error);
      return;
    }
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};
export {postUser, getUserInfo};
