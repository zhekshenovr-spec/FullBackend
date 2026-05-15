import { Router } from 'express';
import postController from '../controllers/post-controller.js';

const router = new Router();

//CRUD Постов
router.post("/post", postController.create);
router.get("/posts", postController.getAll);
router.get("/post/:id", postController.getOne); // Убедись, что этот метод есть в post-controller.js
router.put("/post/:id", postController.update);
router.delete("/post/:id", postController.delete);

export default router;