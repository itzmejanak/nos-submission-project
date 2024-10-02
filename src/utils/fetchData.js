// utils/fetchReports.js

export async function fetchData() {
    try {
        const res = await fetch("https://api.allorigins.win/get?url=http%3A%2F%2F172.104.50.136%2F");
        
        // Check if the response is OK
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // Accessing the contents
        const content = data.contents;
        
        // Parse the data
        return parseReportsData(content);

    } catch (error) {
        console.error(error);
        return { reports: [] }; // Return an empty array in case of error
    }
}

function parseReportsData(dataString) {
    // Split the data string into individual report sections
    const reportSections = dataString.match(/Report\s*{[^}]+}/g);

    if (!reportSections) {
        return { reports: [] }; // Return an empty reports array if no matches found
    }

    // Parse each report section
    const reports = reportSections.map(section => {
        // Extract the report ID
        const reportIdMatch = section.match(/id:\s*(\d+)/);
        const reportId = reportIdMatch ? reportIdMatch[1] : null;

        // Extract all assignments in this report
        const assignments = [];
        const assignmentMatches = section.match(/AssignmentReport\s*{([^}]+)}/g);

        if (assignmentMatches) {
            assignmentMatches.forEach(assignmentString => {
                // Extract name, status, and content from each assignment
                const nameMatch = assignmentString.match(/name:\s*"([^"]+)"/);
                const statusMatch = assignmentString.match(/status:\s*(\w+)/);
                const contentMatch = assignmentString.match(/content:\s*"([^"]+)"/);

                const name = nameMatch ? nameMatch[1] : null;
                const status = statusMatch ? statusMatch[1] : null;
                const content = contentMatch ? contentMatch[1] : null;

                assignments.push({
                    assignmentReport: {
                        name: name,
                        status: status,
                        content: content
                    }
                });
            });
        }

        return {
            id: reportId,
            assignments: assignments
        };
    });

    return { reports: reports };
}