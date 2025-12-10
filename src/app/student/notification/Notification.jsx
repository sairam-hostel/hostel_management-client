import React, { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  Megaphone,
  AlertCircle,
  CalendarClock,
  ReceiptIndianRupee,
  CircleDot,
  Loader2
} from "lucide-react";
import { useNotification } from "../../../context/NotificationContext";

const Notification = () => {
  const { notices, unreadCount, markAsRead, loading, fetchNotices } = useNotification();
  const [filter, setFilter] = useState("all"); // 'all' | 'unread'
  const [selected, setSelected] = useState(null);

  // Refresh notices on mount to ensure fresh data
  useEffect(() => {
    fetchNotices();
  }, []);

  // Filter logic
  // API structure assumed: { id/ _id, title, message/description, created_at, type, is_seen (bool) }
  const filtered = filter === "unread"
    ? notices.filter((n) => !n.is_seen)
    : notices;

  const handleSelect = (item) => {
    setSelected(item);
    if (!item.is_seen) {
      markAsRead(item._id || item.id);
    }
  };

  const getTypeIcon = (type, className = "w-5 h-5") => {
    switch (type?.toLowerCase()) {
      case "notice":
        return <Megaphone className={className} />;
      case "leave":
      case "outpass":
        return <CalendarClock className={className} />;
      case "complaint":
        return <AlertCircle className={className} />;
      case "fee":
        return <ReceiptIndianRupee className={className} />;
      default:
        return <Bell className={className} />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type?.toLowerCase()) {
      case "notice":
        return "Hostel Notice";
      case "leave":
      case "outpass":
        return "Outpass / Leave";
      case "complaint":
        return "Complaint Update";
      case "fee":
        return "Fee Alert";
      default:
        return "General";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  }

  if (loading && notices.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-500">Loading notifications...</span>
      </div>
    )
  }

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

        {/* Filter pills */}
        <div className="inline-flex rounded-full bg-white p-1 shadow-sm border border-gray-200">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-full ${filter === "all"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1 ${filter === "unread"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main content: list + detail */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,2.8fr)]">
        {/* Left: list */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">
              Notification List
            </h2>
            <span className="text-xs text-gray-400">
              {filtered.length} item{filtered.length !== 1 && "s"}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-gray-500">
              <p className="font-medium text-gray-700">
                You’re all caught up 🎉
              </p>
              <p className="mt-1 text-gray-500">
                No {filter === "unread" ? "unread " : ""}notifications right now.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 max-h-[460px] overflow-y-auto">
              {filtered.map((item) => (
                <li key={item.id || item._id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-gray-50 transition ${!item.is_seen ? "bg-purple-50/70" : "bg-white"
                      }`}
                  >
                    <div className="mt-1">
                      {getTypeIcon(item.type, "w-5 h-5 text-purple-600")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-sm truncate ${!item.is_seen
                              ? "font-semibold text-gray-900"
                              : "font-medium text-gray-700"
                            }`}
                        >
                          {item.title}
                        </p>
                        {!item.is_seen && (
                          <CircleDot className="w-4 h-4 text-purple-600 shrink-0" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                        {item.description || item.message}
                      </p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        {formatDate(item.created_at || item.time)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: detail */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          {selected ? (
            <>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getTypeIcon(selected.type, "w-6 h-6 text-purple-600")}
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-gray-900">
                    {selected.title}
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700">
                      {getTypeLabel(selected.type)}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {formatDate(selected.created_at || selected.time)}
                    </span>
                    {!selected.is_seen && (
                      <span className="text-[11px] text-amber-600 font-medium">
                        Unread
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                  {selected.description || selected.message}
                </p>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-sm text-gray-500">
              <Bell className="w-8 h-8 text-purple-400 mb-2" />
              <p className="font-medium text-gray-700">
                Select a notification to view details
              </p>
              <p className="mt-1 text-gray-500">
                Click on an item from the list on the left to read the full
                message.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Notification;
