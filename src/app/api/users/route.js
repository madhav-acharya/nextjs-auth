import { getUserProfile } from "@/controllers/usersController";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const userId = request.headers.get("user-id");
        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const response = await getUserProfile(userId);
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Get user profile error:", error);
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}