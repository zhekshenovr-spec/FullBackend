import userModel from "../models/user-model.js";

export default async function roleAdminMiddleware(req, res, next) {
    try {
        const userId = req.user?.id
        if (!userId) {
            return res.json({ message: "Доступ запрещен" })
        }

        const user = await userModel.findById(userId)
        if (!user || user.role !== "ADMIN") {
            return res.json({ message: "Недостаточно прав" })
        }

        next()
    } catch (e) {
        return res.json({ message: "Ошибка" })
    }
}