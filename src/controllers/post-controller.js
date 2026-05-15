import Post from '../models/post-model.js';

class PostController {
    async create(req, res, next) {
        try {
            const { title, content } = req.body;
            const post = await Post.create({ title, content });
            // Возвращаем 201 статус
            return res.status(201).json(post);
        } catch (e) { next(e); }
    }

    async getAll(req, res, next) {
        try {
            const posts = await Post.find();
            return res.json(posts);
        } catch (e) { next(e); }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const post = await Post.findByIdAndUpdate(id, req.body, { new: true });
            
            if (!post) {
                return res.status(404).json({ message: "Пост не найден" });
            }
            
            return res.json(post);
        } catch (e) { next(e); }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const post = await Post.findByIdAndDelete(id);
            
            if (!post) {
                return res.status(404).json({ message: "Пост не найден для удаления" });
            }
            
            return res.json({ message: "Удалено успешно", id });
        } catch (e) { next(e); }
    }
   
    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const post = await Post.findById(id);
            if (!post) {
                return res.status(404).json({ message: "Пост не найден" });
            }
            return res.json(post);
        } catch (e) { next(e); }
    }
}

export default new PostController();