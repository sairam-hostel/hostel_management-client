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

            // SIMULATED API CALL
            /*
            const response = await api.get('/bs1/notice');
            if (response.data && response.data.data) {
                const sorted = response.data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setNotices(sorted);
            } else {
                setNotices([]);
            }
            */

            // MOCK DATA for Demo
            const MOCK_DATA = [
                {
                    _id: 1,
                    type: "notice",
                    title: "Hostel Meeting – Block A",
                    description: "All students in Block A are requested to assemble at 7:00 PM in the common hall.",
                    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago
                    is_seen: false,
                },
                {
                    _id: 2,
                    type: "leave",
                    title: "Outpass Request Approved",
                    description: "Your outpass request from 12-12-2025 to 14-12-2025 has been approved by Warden.",
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
                    is_seen: false,
                },
                {
                    _id: 3,
                    type: "complaint",
                    title: "Complaint Resolved",
                    description: "Your complaint regarding washroom cleaning in Block C has been marked as resolved.",
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
                    is_seen: true,
                },
                {
                    _id: 4,
                    type: "fee",
                    title: "Hostel Fee Reminder",
                    description: "Your hostel fee for the current semester is due on 20-12-2025.",
                    created_at: new Date("2025-12-08T09:30:00").toISOString(),
                    is_seen: true,
                },
            ];

            setTimeout(() => {
                setNotices(MOCK_DATA);
                setLoading(false);
            }, 800);

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

            // API call
            // await api.post('/bs1/notice/seen', { notice_id: noticeId });

            // Optionally refetch or just leave the optimistic update
        } catch (err) {
            console.error("Failed to mark notice as read:", err);
            // Revert optimistic update if needed, but for 'read' status it's usually fine to fail silently or retry
        }
    };

    // Calculate unread count
    // Assuming 'is_seen' is the property. If the API returns a list of users who saw it, logic might differ.
    // Based on "GET Notice sAPI", usually it returns objects. 
    // If the object has a boolean 'is_seen' specific to the user (common in specialized view), use that.
    const unreadCount = notices.filter(n => !n.is_seen).length;

    useEffect(() => {
        // Initial fetch
        // Only fetch if we have a token (user is logged in) - simple check
        if (localStorage.getItem('token')) {
            fetchNotices();
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
