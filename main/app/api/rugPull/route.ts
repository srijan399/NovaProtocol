"use server";

import { NextRequest, NextResponse } from 'next/server';

async function getHandler(req: NextRequest) {

    // Handle the request and return a response
    return NextResponse.json({ rugPull: true, message: "Rug pull detected" }, { status: 200 });
}

export {
    getHandler as GET
}