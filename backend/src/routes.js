const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');

const LikeController = require('./controllers/LikeController');
const PostController = require('./controllers/PostController');

const routes = new express.Router();
const upload = multer(uploadConfig);

routes.get('/posts', PostController.index);
routes.post('/posts', upload.single('image'), PostController.store);

routes.post('/posts/:id/like', LikeController.store);

module.exports = routes;