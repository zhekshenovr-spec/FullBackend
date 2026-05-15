import postModel from "../models/post-model.js"

export default async function roleAuthorMiddleware(req, res, next) {
    try {
        const userId = req.user?.id
        const postId = req.params.id

        if (!userId) {
            return res.json({ message: "Доступ запрещен" })
        }

        const post = await postModel.findById(postId)
        if (!post) {
            return res.status(404).json({ message: "Пост не найден" })
        }

        if (post.author.toString() !== userId) { 
            return res.status(403).json({ message: "Вы не являетесь автором поста" })
        }

        next()
    } catch (e) {
        return res.status(500).json({ message: "Ошибка" })
    }
}