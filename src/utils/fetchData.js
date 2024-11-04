export async function fetchData() {
    try {
        const res = await fetch("/api/"); // Fetch from Netlify proxy

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error(error);
        return [];
    }
}
