import jwt from 'jsonwebtoken';
import userModel from '../../DB/model/User.model.js';

export const auth = (accessRole = []) => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            if (!authorization.startsWith(process.env.BEARERKEY)) {
                return res.status(400).json({ message: "Invalid authorization" });
            }

            const token = authorization.split(process.env.BEARERKEY)[1];
            if (!token) {
                return res.status(400).json({ message: "Invalid authorization" });
            }

            const decoded = jwt.verify(token, process.env.LOGINSECRET);

            const user = await userModel.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ message: "Not register user" });
            }
            if (!accessRole.includes(user.role)) {
                return res.status(403).json({ message: "Not authorized user" });
            }

            req.user = user;
            next();

        } catch (error) {
            return res.status(500).json({ message: "Catch an error", error: error.stack });
        }
    }
}