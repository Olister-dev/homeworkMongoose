'use strict';

const _ = require('lodash');
const User = require('../models/user');
const Article = require('../models/article');

module.exports = {createUser, updateUser, getUser, deleteUser, getUserArticles};

async function createUser(req, res, next) {
  try {
    const fields = ['firstName', 'lastName', 'role', 'numberOfArticles', 'nickname'];
    const payload = _.pick(req.body, fields);

    const user = new User(payload);
    const newUser = await user.save();

    console.log(newUser);

    return res.status(200).json(newUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, {
      $set: {firstName: req.body.firstName, lastName: req.body.lastName}
    });
    await user.save();
    res.status(200).json('user updated');
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.userId);
    const articles = await Article.find({owner: req.params.userId});
    const userAndArticles = {...user.toObject(), articles};
    // user.articles = articles;
    console.log(userAndArticles);
    res.status(200).json(userAndArticles);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    await User.deleteOne({_id: req.params.userId});
    await Article.deleteMany({owner: req.params.userId});
    res.status(200).json('deleted');
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function getUserArticles(req, res, next) {
  try {
    const articles = await Article.find({owner: req.params.userId});
    res.status(200).json(articles);
  } catch (error) {
    console.log(error);
    next(error);
  }
}
