/* eslint-disable new-cap */
import express from 'express';
import {body} from 'express-validator';
import {validationErrors} from '../../middlewares.js';
import {postUser} from '../controllers/user-controller.js';
const userRouter = express.Router();

userRouter.route('/register').post(
  body('tunnus')
    .trim()
    .isLength({min: 4, max: 20})
    .withMessage('Tunnuksen tulee olla vähintään 4 merkkiä pitkä'),
  body('salasana')
    .trim()
    .isLength({min: 4, max: 30})
    .withMessage('Salasanan tulee olla vähintään 4 merkkiä pitkä'),
  body('email')
    .isEmail()
    .withMessage('Sähköpostin tulee olla oikeassa muodossa'),
  body('puhelin')
    .isMobilePhone('fi-FI')
    .withMessage('Puhelinnumeron tulee olla suomalainen puhelinnumero'),
  body('etunimi')
    .isAlpha()
    .isLength({min: 2, max: 30})
    .withMessage('Etunimi ei saa sisältää numeroita'),
  body('sukunimi')
    .isAlpha()
    .isLength({min: 2, max: 30})
    .withMessage('Sukunimi ei saa sisältää numeroita'),
  body('katuosoite')
    .isLength({min: 5, max: 50})
    .withMessage('Katuosoitteen tulee olla vähintään 5 merkkiä pitkä'),
  body('postinumero')
    .isPostalCode('FI')
    .withMessage('Postinumeron tulee olla muotoa 12345'),
  body('postitoimipaikka')
    .isAlpha()
    .isLength({min: 2, max: 50})
    .withMessage('Postitoimipaikka ei saa sisältää numeroita'),

  validationErrors,
  postUser
);
export default userRouter;
