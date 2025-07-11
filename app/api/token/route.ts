import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest, res: NextResponse) {
    const cookieStore = cookies();
    const cookieString = (await cookieStore).toString();
    console.log('cookieString:::',cookieString)
    return NextResponse.json({})
}