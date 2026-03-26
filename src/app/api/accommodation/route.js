import { google } from "googleapis";
import { NextResponse } from "next/server";

const SHEET_NAME = "Sheet1";

console.log("[Accommodation API] GOOGLE_SHEET_ID loaded:", !!process.env.GOOGLE_SHEET_ID);
console.log("[Accommodation API] GOOGLE_SERVICE_ACCOUNT_KEY loaded:", !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

function getAuth() {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return auth;
}

function getSheets(auth) {
    return google.sheets({ version: "v4", auth });
}

// GET /api/accommodation?uniqueId=KRIYA-26-XXXX
// Check if user is already registered for accommodation
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const uniqueId = searchParams.get("uniqueId");

        if (!uniqueId) {
            return NextResponse.json(
                { success: false, message: "uniqueId is required" },
                { status: 400 }
            );
        }

        const auth = getAuth();
        const sheets = getSheets(auth);
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${SHEET_NAME}!A:K`,
        });

        const rows = response.data.values || [];

        // Skip header row (index 0), search for matching Kriya ID in column A
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0] && rows[i][0].trim() === uniqueId.trim()) {
                return NextResponse.json({
                    success: true,
                    registered: true,
                    data: {
                        name: rows[i][1] || "",
                        phone: rows[i][2] || "",
                        college: rows[i][3] || "",
                        fromDate: rows[i][4] || "",
                        toDate: rows[i][5] || "",
                        city: rows[i][6] || "",
                        address: rows[i][7] || "",
                        year: rows[i][8] || "",
                        email: rows[i][9] || "",
                        gender: rows[i][10] || "",
                    },
                });
            }
        }

        return NextResponse.json({ success: true, registered: false });
    } catch (error) {
        console.error("Error checking accommodation:", error);
        return NextResponse.json(
            { success: false, message: "Failed to check accommodation status" },
            { status: 500 }
        );
    }
}

// POST /api/accommodation
// Register user for accommodation
export async function POST(request) {
    try {
        const body = await request.json();
        const { uniqueId, name, email, phone, college, year, fromDate, toDate, city, address, gender } = body;

        if (!uniqueId || !fromDate || !toDate || !city || !address || !gender) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        const auth = getAuth();
        const sheets = getSheets(auth);
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        // Check if already registered
        const existing = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${SHEET_NAME}!A:A`,
        });

        const rows = existing.data.values || [];
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0] && rows[i][0].trim() === uniqueId.trim()) {
                return NextResponse.json(
                    { success: false, message: "Already registered for accommodation" },
                    { status: 409 }
                );
            }
        }

        // Append new row: Kriya ID | Name | Phone | College | From date | To date | City | Residential address | year | Email | Gender
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${SHEET_NAME}!A:K`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[uniqueId, name, phone, college, fromDate, toDate, city, address, year, email, gender]],
            },
        });

        return NextResponse.json({ success: true, message: "Accommodation registered successfully" });
    } catch (error) {
        console.error("Error registering accommodation:", error);
        return NextResponse.json(
            { success: false, message: "Failed to register for accommodation" },
            { status: 500 }
        );
    }
}
