import jwt from 'jsonwebtoken';

export const signToken = (user) => {
    if (!user || !user._id) {
        throw new Error('User object with _id is required to sign a token');
    }

    const payload = {
        id: user._id,
        fullName: user.fullName,
        email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    return token;
}
export const verifyToken = (token) => {
    if (!token) {
        throw new Error('Token is required for verification');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}
export const decodeToken = (token) => {
    if (!token) {
        throw new Error('Token is required for decoding');
    }

    try {
        const decoded = jwt.decode(token);
        return decoded;
    } catch (error) {
        throw new Error('Error decoding token');
    }
}