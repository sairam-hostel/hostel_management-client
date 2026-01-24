import React, { useState, useEffect } from "react";
import {
  BellRing,
  Megaphone,
  AlertCircle,
  CalendarClock,
  ReceiptIndianRupee,
  Bell,
  X
} from "lucide-react";
import { useNotification } from "../../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import ApiTableManager from "../../../component/ApiTableManager";

const Notification = () => {
  const navigate = useNavigate();
  // Use notices from context directly to ensure sync with read status
  const { notices, unreadCount, markAsRead, fetchNotices } = useNotification();

  // Still fetch notices for the global unread count context
  useEffect(() => {
    fetchNotices();
  }, []);

  const getTypeIcon = (type, className = "w-5 h-5") => {
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
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  }

  const handleView = async (notice) => {
    if (!notice.is_seen) {
      await markAsRead(notice._id || notice.id);
    }
    navigate(`/student/notification/${notice._id || notice.id}`);
  };

  const columns = [
    {
      header: "Category",
      accessor: "category",
      className: "w-24 hidden md:table-cell",
      render: (row) => (
        <span className="text-sm text-gray-600 capitalize">
          {row.category || 'General'}
        </span>
      )
    },
    {
      header: "Priority",
      accessor: "priority",
      className: "w-24 hidden sm:table-cell",
      render: (row) => {
        const priority = row.priority?.toLowerCase() || 'low';
        const colors = {
          high: 'bg-red-50 text-red-700 ring-red-600/10',
          medium: 'bg-yellow-50 text-yellow-700 ring-yellow-600/10',
          low: 'bg-green-50 text-green-700 ring-green-600/10'
        };
        const colorClass = colors[priority] || colors.low;

        return (
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorClass} capitalize`}>
            {priority}
          </span>
        );
      }
    },
    {
      header: "Title",
      accessor: "title",
      render: (row) => (
        <div
          onClick={() => handleView(row)}
          className="cursor-pointer group"
        >
          <p className={`text-sm group-hover:text-purple-700 transition-colors ${!row.is_seen ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
            {row.title}
          </p>
          <p className="text-xs text-gray-500 line-clamp-1">{row.description || row.message}</p>
        </div>
      )
    },
    {
      header: "Date",
      accessor: "created_at",
      className: "w-32",
      render: (row) => (
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {formatDate(row.created_at || row.time || row.date)}
        </span>
      )
    },
  ];


  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <BellRing className="w-6 h-6 text-purple-600" />
            Notifications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Latest updates related to your hostel, outpass, and complaints.
          </p>
        </div>


      </div>

      {/* API Table */}
      <ApiTableManager
        dataSource={notices}
        onRefresh={fetchNotices}
        columns={columns}
        title="All Notifications"
        searchPlaceholder="Search notices..."
      />

    </div>
  );
};

export default Notification;
