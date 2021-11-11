'use strict';

const _ = require('lodash');
const Article = require('../models/article');
const User = require('../models/user');

module.exports = {createArticle, editArticle, getArticle, deleteArticle};

async function createArticle(req, res, next) {
  try {
    const fields = ['title', 'subtitle', 'description', 'owner', 'category'];
    const payload = _.pick(req.body, fields);
    const realUser = await User.findById(payload.owner);

    console.log('-_---------', realUser);
    if (!realUser) {
      return res.status(400).json('Invalid user id');
    }

    const article = new Article(payload);
    const newArticle = await article.save();

    realUser.numberOfArticles += 1;
    await realUser.save();

    console.log(newArticle);

    return res.status(200).json(newArticle);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function editArticle(req, res, next) {
  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) {
      return res.status(400).json('There no such article');
    }
    const user = await User.findById(req.body.owner);
    if (!user) {
      return res.status(400).json('There no such user');
    }
    const articleForUpdate = await Article.findByIdAndUpdate(req.params.articleId, {
      $set: {
        title: req.body.title,
        subtitle: req.body.subtitle,
        owner: req.body.owner,
        description: req.body.description,
        category: req.body.category
      }
    });
    await articleForUpdate.save();
    res.status(200).json('Article updated ');
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function getArticle(req, res, next) {
  try {
    const filter = {};
    if (req.query.title) {
      filter.title = req.query.title;
    }
    if (req.query.subtitle) {
      filter.subtitle = req.query.subtitle;
    }
    if (req.query.owner) {
      filter.owner = req.query.owner;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.createdAt) {
      filter.createdAt = req.query.createdAt;
    }
    if (req.query.updatedAt) {
      filter.updatedAt = req.query.updatedAt;
    }

    const article = await Article.find(filter);
    console.log(article);
    res.status(200).json(article);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function deleteArticle(req, res, next) {
  try {
    const article = await Article.findById(req.params.articleId);
    const user = await User.findById(article.owner);
    await Article.deleteOne({_id: req.params.articleId});

    console.log(user);
    user.numberOfArticles -= 1;
    await user.save();
    res.status(200).json('Article deleted ');
  } catch (error) {
    console.log(error);
    next(error);
  }
}
