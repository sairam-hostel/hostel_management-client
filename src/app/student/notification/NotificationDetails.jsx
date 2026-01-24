import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';
import {
    ArrowLeft,
    Megaphone,
    CalendarClock,
    AlertCircle,
    ReceiptIndianRupee,
    Bell,
    Clock,
    CheckCircle2
} from 'lucide-react';

const NotificationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { notices, markAsRead, loading } = useNotification();
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        if (notices.length > 0) {
            const found = notices.find(n => (n._id || n.id) === id);
            setNotice(found);

            if (found && !found.is_seen) {
                markAsRead(found._id || found.id);
            }
        }
    }, [id, notices]);

    const getTypeIcon = (type, className = "w-6 h-6") => {
        switch (type?.toLowerCase()) {
            case "notice": return <Megaphone className={className} />;
            case "leave":
            case "outpass": return <CalendarClock className={className} />;
            case "complaint": return <AlertCircle className={className} />;
            case "fee": return <ReceiptIndianRupee className={className} />;
            default: return <Bell className={className} />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (loading && !notice) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse text-purple-600">Loading details...</div>
            </div>
        );
    }

    if (!notice && !loading && notices.length > 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">Notification not found</h2>
                <p className="mt-2 text-gray-500 mb-6">The notification you're looking for doesn't exist or has been removed.</p>
                <button
                    onClick={() => navigate('/student/notification')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                    Go Back to Notifications
                </button>
            </div>
        );
    }

    if (!notice) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/student/notification')}
                className="group flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-8 transition-colors"
            >
                <div className="p-2 rounded-full group-hover:bg-purple-50 transition-colors">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                </div>
                <span className="font-medium">Back to Notifications</span>
            </button>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="relative bg-gradient-to-b from-gray-50/50 to-white px-8 pt-10 pb-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        {/* Icon Box */}
                        <div className="flex-shrink-0">
                            <div className="h-16 w-16 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center text-purple-600">
                                {getTypeIcon(notice.type, "w-8 h-8")}
                            </div>
                        </div>

                        {/* Title & Metadata */}
                        <div className="flex-1 min-w-0">
                            {/* Badges Row */}
                            <div className="flex flex-wrap items-center gap-2.5 mb-4">
                                {/* Type Badge */}
                                <span className="inline-flex items-center rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 uppercase tracking-wide">
                                    {notice.type || 'General'}
                                </span>

                                {/* Category Badge - Hide if same as Type */}
                                {notice.category && notice.category.toLowerCase() !== (notice.type || '').toLowerCase() && (
                                    <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 uppercase tracking-wide">
                                        {notice.category}
                                    </span>
                                )}

                                {/* Priority Badge */}
                                {notice.priority && (
                                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wide
                                        ${(notice.priority.toLowerCase() === 'high' ? 'bg-red-50 text-red-700 border border-red-100' :
                                            (notice.priority.toLowerCase() === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                'bg-green-50 text-green-700 border border-green-100'))}
                                    `}>
                                        {notice.priority} Priority
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
                                {notice.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-gray-400" />
                                    <span>{formatDate(notice.created_at || notice.time)}</span>
                                </div>

                                {notice.is_seen && (
                                    <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                                        <CheckCircle2 size={14} />
                                        <span>Read</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="px-8 py-10">
                    <div className="prose prose-purple max-w-none">
                        <p className="whitespace-pre-wrap text-base text-gray-700 leading-relaxed font-normal">
                            {notice.description || notice.message}
                        </p>
                    </div>

                    {/* Additional Metadata Footer (Optional details) */}
                    {(notice.sender || notice.attachment) && (
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Additional Details</h4>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                                {notice.sender && (
                                    <div>
                                        <dt className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Sent By</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{notice.sender}</dd>
                                    </div>
                                )}
                                {/* Add more fields here if available in the future */}
                            </dl>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationDetails;
