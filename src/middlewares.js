import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {validationResult} from 'express-validator';
import OpenAI from 'openai';
import fs from 'fs';
import 'dotenv/config';
import * as https from 'https';

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  throw new Error(
    'OpenAI API key is not set. Please add it to your .env file.'
  );
}

const openai = new OpenAI({apiKey: openaiApiKey});
const validationErrors = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.path}: ${error.msg}`)
      .join(', ');
    const error = new Error(messages);
    error.status = 400;
    next(error);
    return;
  }
  next();
};
const getAiImage = async (req, res, next) => {
  const ingredientList = req.body.ingredient_names.join(', ');

  try {
    const response = await openai.images.generate({
      model: 'dall-e-2',
      prompt: `Name of dish: ${req.body.name}. Description of the dish: ${req.body.description}, with toppings : ${ingredientList}, include cheese by default. Type of the dish: ${req.body.category_name}.`,
      size: '1024x1024',
    });

    if (!response.data[0].url) {
      const error = new Error('Image not generated');
      error.status = 500;
      return next(error);
    }
    console.log(response.data[0]);
    res.locals.url = response.data[0].url;

    next();
  } catch (error) {
    console.error('Error generating image:', error);

    const newError = new Error('Failed to generate AI image');
    newError.status = 500;
    next(newError);
  }
};
const saveAiImage = async (req, res, next) => {
  const imageName = req.body.name.replace(/\s+/g, '_') + '.png';
  const file = fs.createWriteStream('./uploads/' + imageName);
  if (!res.locals.url) {
    res.locals.file = 'default.png';
    next();
    return;
  }

  https
    .get(res.locals.url, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Image downloaded from ${res.locals.url}`);
      });
    })
    .on('error', (err) => {
      fs.unlink(imageName, () => {
        console.error(`Error downloading image: ${err.message}`);
      });
    });
  res.locals.file = imageName;
  next();
};

const authenticateToken = (req, res, next) => {
  console.log('authenticateToken', req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('token', token);
  if (token == null) {
    return res.sendStatus(401);
  }
  try {
    res.locals.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).send({message: 'invalid token'});
  }
};

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
};
export {
  authenticateToken,
  notFoundHandler,
  errorHandler,
  validationErrors,
  getAiImage,
  saveAiImage,
};
