/*import { useState, useEffect, useMemo } from 'react';
import type { User } from "../types/user";

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            // ... simulazione fetch ...
            setUsers(mockData);
            setLoading(false);
        };
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter(u =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    return {
        users,
        loading,
        searchQuery,
        setSearchQuery,
        filteredUsers
    };
};*/