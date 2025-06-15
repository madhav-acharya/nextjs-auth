import connectDB from "@/config/dbConfig";
import User from "@/models/usersModel";
import bcryptjs from 'bcryptjs';
import { signToken } from "@/lib/jwt";
import { log } from "console";

export const signup = async (data) => {
    const { fullName, email, password } = data;
    if (!fullName || !email || !password) {
        throw new Error('All fields are required');
    }
    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    if (!hashedPassword) {
        throw new Error('Error hashing password');
    }

    await connectDB();

    const existingUser = await User.findOne({
        email: email.toLowerCase()
    });
    if (existingUser) {
        throw new Error('User already exists with this email');
    }
    const newUser = new User({
        fullName,
        email: email.toLowerCase(),
        password: hashedPassword
    });
    await newUser.save();

    const token = signToken(newUser);
    if (!token) {
        throw new Error('Error signing token');
    }
    return {
        message: 'User created successfully',
        token: token,
        success: true,
        user: {
            ...newUser._doc,
        }
    };
}

export const login = async (data) => {
    const { email, password } = data;
    console.log('Login data:', data);
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordMatched = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatched) {
        throw new Error('Invalid email or password');
    }

    const token = signToken(user);
    if (!token) {
        throw new Error('Error signing token');
    }
    return {
        message: 'Login successful',
        token: token,
        success: true,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email
        }
    };
}

export const getUserProfile = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    return {
        message: 'User profile retrieved successfully',
        success: true,
        user: {
            ...user._doc,
        }
    };
}