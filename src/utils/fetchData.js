// utils/fetchReports.js
export async function fetchData() {
    try {
        const res = await fetch("/.netlify/functions/fetchData");
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        
        return data; // Directly return the data array as per the new format

    } catch (error) {
        console.error(error);
        return []; // Return an empty array in case of error
    }
}