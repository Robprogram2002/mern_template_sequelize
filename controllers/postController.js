const { validationResult } = require("express-validator");
const { Post, User } = require("../models/");

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }

  const { title, content } = req.body;
  const imageUrl = req.file.path;

  try {
    const newPost = await Post.create({
      title: title,
      content: content,
      imageUrl: imageUrl,
      userId: req.userId,
    });

    const creator = await User.findByPk(req.userId);

    res.status(201).json({
      message: "Post created successfully!",
      post: { ...newPost.toJSON(), creator: creator.toJSON() },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 5;
  try {
    const { count, rows: posts } = await Post.findAndCountAll({
      limit: perPage,
      order: [["createdAt", "DESC"]],
      include: [User],
      offset: (currentPage - 1) * perPage,
    });

    res.status(200).json({
      message: "Fetched posts successfully.",
      posts: posts,
      totalItems: count,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(err);
  }
};

exports.getSinglePost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findByPk(postId, { include: [User] });
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Post fetched.", post: post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = req.file.path;
    }
    if (!imageUrl) {
      const error = new Error("No file picked.");
      error.statusCode = 422;
      throw error;
    }

    const post = await Post.findByPk(postId, { include: [User] });

    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.id !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    // if (imageUrl !== post.imageUrl) {
    //   clearImage(post.imageUrl);
    // }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const result = await post.save();

    res.status(200).json({ message: "Post updated!", post: result });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findByPk(postId, { include: [User] });

    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.id !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    // Check logged in user
    // clearImage(post.imageUrl);

    res.status(200).json({ message: "Deleted post." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
