import { google } from "googleapis";
export const prerender = false; // makes this a dynamic server route

export async function POST({ request }: { request: Request }) {
    console.log("reached!")
    try {

        const data = await request.formData();
        const name = data.get("name");
        const email = data.get("email");
        const date = new Date().toISOString();

        //Authentication
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(import.meta.env.GOOGLE_SERVICE_ACCOUNT_JSON),
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });
        const spreadsheetId = "1FtZ4s2B4inV5Wl8cbC2Zo9hiuMld_9BlJfTmBdXOtoY";
        const range = "Sheet1!A2:C2";

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[name, email, date]],
            },
        });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            return new Response(JSON.stringify({success: false, message: err.message}), {status: 500})
        }
    }
};

