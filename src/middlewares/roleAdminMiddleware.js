import userModel from "../models/user-model.js";

export default async function roleAdminMiddleware(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        const user = await userModel.findById(userId)
        if (!user || user.role !== "ADMIN") {
            return res.status(403).json({ message: "Insufficient permissions" })
        }

        next()
    } catch (e) {
        return res.status(500).json({ message: "Server error" })
    }
}