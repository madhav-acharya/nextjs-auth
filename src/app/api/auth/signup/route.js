import { NextResponse } from 'next/server';
import { signup } from '@/controllers/usersController';
import { log } from 'console';

export async function POST(request) {
    try {
        const data = await request.json();
        log("data", data);
        const response = await signup(data);
        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}