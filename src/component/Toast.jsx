import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for exit animation
    };

    const styles = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: <CheckCircle className="w-5 h-5 text-green-500" />
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: <AlertCircle className="w-5 h-5 text-red-500" />
        },
        info: {
             bg: 'bg-blue-50',
             border: 'border-blue-200',
             text: 'text-blue-800',
             icon: <Info className="w-5 h-5 text-blue-500" />
        },
        warning: {
             bg: 'bg-yellow-50',
             border: 'border-yellow-200',
             text: 'text-yellow-800',
             icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />
        }
    };

    const style = styles[type] || styles.info;

    return (
        <div 
            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 transform pointer-events-auto
                ${style.bg} ${style.border}
                ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
            style={{ minWidth: '300px', maxWidth: '400px' }}
        >
            <div className="shrink-0">{style.icon}</div>
            <p className={`flex-1 text-sm font-medium ${style.text}`}>{message}</p>
            <button 
                onClick={handleClose}
                className="shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors text-gray-500"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
