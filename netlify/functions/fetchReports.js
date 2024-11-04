// netlify/functions/fetchReports.js
import fetch from "node-fetch";

export async function handler () {
    try {
        const response = await fetch("http://172.104.50.136:8080/");
        const data = await response.json();
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error fetching data" }),
        };
    }
}
