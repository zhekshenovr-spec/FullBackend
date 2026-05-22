import postsData from '../data/static-posts.js';
export default async function roleAuthorMiddleware(req, res, next) {
    try {
        const userId = req.user?.id;
        const postId = req.params.id; // Берем ID поста из параметров запроса URL
        if (!userId) {
            return res.status(403).json({ message: "Access denied. Not authorized." });
        }
        const post = postsData.find(p => p._id === postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.author !== userId) {
            return res.status(403).json({ message: "You are not the author of this post" });
        }
        next();
    } catch (e) {
        return res.status(500).json({ message: "Server error inside author middleware" });
    }
}