import { v4 as uuidv4 } from 'uuid';
import postsData from '../data/static-posts.js';

class PostController {
    async create(req, res) {
        try {
            const { title, content, category } = req.body;
            const authorId = req.user?.id || "65f1c2b3e4b0a123456789ab";
            if (!title || !content || !category) {
                return res.status(400).json({ message: "Поля title, content и category обязательны" });
            }
            const newPost = {
                _id: uuidv4(),
                title,
                content,
                category: category.toLowerCase(),
                author: authorId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            postsData.unshift(newPost);
            return res.status(201).json(newPost);
        } catch (e) {
            return res.status(500).json({ message: "Ошибка при создании поста", error: e.message });
        }
    }
    async getAll(req, res) {
        try {
            let { page = 1, limit = 20, category } = req.query;
            page = parseInt(page);
            limit = parseInt(limit);
            if (limit > 20) limit = 20;
            if (limit < 1) limit = 1;
            if (page < 1) page = 1;
            let filteredPosts = [...postsData];
            if (category) {
                filteredPosts = filteredPosts.filter(p => p.category === category.toLowerCase());
            }
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
            return res.json({
                totalItems: filteredPosts.length,
                totalPages: Math.ceil(filteredPosts.length / limit),
                currentPage: page,
                limit: limit,
                posts: paginatedPosts
            });
        } catch (e) {
            return res.status(500).json({ message: "Ошибка при получении постов", error: e.message });
        }
    }
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const post = postsData.find(p => p._id === id);
            if (!post) return res.status(404).json({ message: "Пост не найден" });
            return res.json(post);
        } catch (e) {
            return res.status(500).json({ message: "Ошибка", error: e.message });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, content, category } = req.body;

            const postIndex = postsData.findIndex(p => p._id === id);
            if (postIndex === -1) return res.status(404).json({ message: "Пост не найден" });

            postsData[postIndex] = {
                ...postsData[postIndex],
                title: title || postsData[postIndex].title,
                content: content || postsData[postIndex].content,
                category: category ? category.toLowerCase() : postsData[postIndex].category,
                updatedAt: new Date().toISOString()
            };

            return res.json(postsData[postIndex]);
        } catch (e) {
            return res.status(500).json({ message: "Ошибка", error: e.message });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const postIndex = postsData.findIndex(p => p._id === id);
            if (postIndex === -1) return res.status(404).json({ message: "Пост не найден" });

            postsData.splice(postIndex, 1);
            return res.json({ message: "Пост успешно удален" });
        } catch (e) {
            return res.status(500).json({ message: "Ошибка", error: e.message });
        }
    }
}

export default new PostController();