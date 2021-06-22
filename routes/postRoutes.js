const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middleware/is-auth");

// controllers
const {
  createPost,
  deletePost,
  getPosts,
  updatePost,
  getSinglePost,
} = require("../controllers/postController");

const router = express.Router();

router.post(
  "/create",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  createPost
);

router.get("/all", isAuth, getPosts);

router.get("/:postId", isAuth, getSinglePost);

router.delete("/:postId", isAuth, deletePost);

router.put(
  "/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  updatePost
);

module.exports = router;
