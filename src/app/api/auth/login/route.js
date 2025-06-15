import { NextResponse } from "next/server";
import { login } from "@/controllers/usersController";

export async function POST(request) {
    try {
        const data = await request.json();
        const response = await login(data);
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}