import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {validationResult} from 'express-validator';
import {getUserByName} from '../models/user-model.js';
import 'dotenv/config';

const postLogin = async (req, res, next) => {
  const user = await getUserByName(req.body.tunnus);
  try {
    if (!user || !bcrypt.compareSync(req.body.salasana, user.salasana)) {
      const error = new Error('Incorrect username or password');
      error.status = 401;
      return next(error);
    }

    const userWithNoPassword = {
      id: user.id,
      tunnus: user.tunnus,
      rooli: user.rooli,
    };

    const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({user: userWithNoPassword, token});
  } catch (e) {
    next(e);
  }
};

const getMe = async (req, res) => {
  console.log('getMe', res.locals.user);
  if (res.locals.user) {
    res.json({message: 'token ok', user: res.locals.user});
  } else {
    res.sendStatus(401);
  }
};

export {postLogin, getMe};
