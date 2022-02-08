const express = require("express");
const { append } = require("express/lib/response");
const router = express.Router();

router.post("/delete-article", async (req, res) => {
  let article_id = req.body.article_id;

  await db.none("DELETE FROM articles WHERE article_id = $1", [article_id]);
  res.redirect("/articles");
});

router.get("/add-article", (req, res) => {
  res.render("add-article");
});

router.post("/add-article", async (req, res) => {
  let title = req.body.title;
  let description = req.body.title;
  let userId = req.session.user.userId;

  await db.none("INSERT INTO articles(title, body, user_id) VALUES($1,$2,$3)", [
    title,
    description,
    userId,
  ]);
  res.redirect("/users/articles");
});

router.post("/update-article", async (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let articleId = req.body.articleId;

  await db.none(
    "UPDATE articles SET title = $1, body = $2 WHERE article_id = $3",
    [title, description, articleId]
  );
  res.redirect("/users/articles");
});

router.get("/articles/edit/:articleId", async (req, res) => {
  let articleId = req.params.articleId;

  let article = await db.one(
    "SELECT article_id,title,body FROM articles WHERE article_id = $1",
    [articleId]
  );
  res.render("edit-article", article);
});

router.get("/articles", async (req, res) => {
  let userId = req.session.user.userId;

  let articles = await db.any(
    "SELECT article_id, title, body FROM articles WHERE user_id = $1",
    [userId]
  );
  res.render("articles", { articles: articles });
});

module.exports = router;
