// API_BASE_URL = "/api";
 const API_BASE_URL =
     "http://localhost:3001/express-api";
// const API_BASE_URL =
//     import.meta.env.VITE_API_BASE_URL;


async function apiClient(
    endpoint,
    options = {}
) {
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type":
                    "application/json",

                ...(options.headers || {})
            }
        }
    );

    const contentType =
        response.headers.get(
            "content-type"
        );

    let data = null;

    if (
        contentType?.includes(
            "application/json"
        )
    ) {
        data = await response.json();
    } else {
        const text =
            await response.text();

        data = text || null;
    }

    if (!response.ok) {
        const message =
            data?.message ||
            data?.mensaje ||
            data?.error ||
            (
                typeof data === "string"
                    ? data
                    : null
            ) ||
            `Error HTTP ${response.status}`;

        throw new Error(message);
    }

    return data;
}

export default apiClient;