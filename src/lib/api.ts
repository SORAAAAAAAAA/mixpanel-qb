const api = process.env.NEXT_PUBLIC_API_URL;

// Get Users from database
export const getUsers = async () => {

    const response = await fetch(`${api}/api/users`);

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    return data;
}