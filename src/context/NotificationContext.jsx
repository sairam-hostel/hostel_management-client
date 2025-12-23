import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotices = async () => {
        try {
            setLoading(true);

            // REAL API CALL
            const response = await api.get('/bs1/notices');
            console.log("Notices Response:", response.data);

            const fetchedNotices = Array.isArray(response.data) ? response.data : (response.data.data || []);

            const sorted = fetchedNotices.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));
            setNotices(sorted);
            setLoading(false);

            setError(null);
        } catch (err) {
            console.error("Failed to fetch notices:", err);
            setError("Failed to load notifications");
            setLoading(false);
        }
    };

    const markAsRead = async (noticeId) => {
        try {
            // Optimistic update
            setNotices(prev => prev.map(n =>
                n._id === noticeId ? { ...n, is_seen: true } : n
            ));
            // Optionally refetch or just leave the optimistic update
            // Persist to server
            // Persist to server
            await api.post(`/bs1/notices/seen`, { noticeId });
        } catch (err) {
            console.error("Failed to mark notice as read:", err);
            // Revert optimistic update on failure
            setNotices(prev => prev.map(n =>
                n._id === noticeId ? { ...n, is_seen: false } : n
            ));
        }
    };

    // Based on "GET Notice sAPI"
    // If the object has a boolean 'is_seen' specific to the user (common in specialized view), use that.
    const unreadCount = notices.filter(n => !n.is_seen).length;

    useEffect(() => {
        // Initial fetch
        // Only fetch if we have a token (user is logged in) - simple check
        if (localStorage.getItem('token')) {
            fetchNotices();
        } else {
            setLoading(false);
        }
    }, []);

    const value = {
        notices,
        loading,
        error,
        unreadCount,
        fetchNotices,
        markAsRead
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
