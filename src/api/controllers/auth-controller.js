import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {getUserByName} from '../models/user-model.js';
import 'dotenv/config';

const postLogin = async (req, res) => {
  console.log('postLogin', req.body);
  const user = await getUserByName(req.body.tunnus);
  if (!user) {
    res.sendStatus(401);
    return;
  }

  if (!bcrypt.compareSync(req.body.salasana, user.salasana)) {
    res.sendStatus(401);
    return;
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
