// utils/fetchReports.js
const API_BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://your-netlify-site.netlify.app/.netlify/functions/fetchReports"
        : "http://172.104.50.136:8080/";

export async function fetchData() {
    try {
        const res = await fetch(API_BASE_URL);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}
