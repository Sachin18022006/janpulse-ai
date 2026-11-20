import React, { createContext, useContext, useState } from 'react';
import { MessageSquare, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const sendNotification = ({ type = 'sms', title, recipient, message }) => {
    const id = Date.now() + Math.random();
    const newNotification = { id, type, title, recipient, message, timestamp: new Date() };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 4));

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      dismissNotification(id);
    }, 6000);
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ sendNotification }}>
      {children}

      {/* Floating SMS / WhatsApp Live Simulator Toast Hub */}
      <div className="fixed bottom-5 right-5 z-50 space-y-3 max-w-sm w-full pointer-events-none">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="pointer-events-auto bg-charcoal-900/95 text-white p-4 rounded-2xl shadow-warm-xl border border-charcoal-700 backdrop-blur-md transition-all transform animate-slide-up space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5 text-mustard font-bold">
                <MessageSquare className="w-4 h-4 text-forest-400" />
                <span>BBMP Civic SMS Gateway</span>
              </div>
              <button
                onClick={() => dismissNotification(item.id)}
                className="text-charcoal-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-[11px] text-charcoal-300 font-mono">
              To: <strong className="text-white">{item.recipient || '+91 98450 12345 (Citizen)'}</strong>
            </div>

            <p className="text-xs text-charcoal-100 font-medium leading-relaxed bg-charcoal-800/80 p-2.5 rounded-xl border border-charcoal-700">
              {item.message}
            </p>

            <div className="flex justify-between items-center text-[10px] text-charcoal-400 pt-1">
              <span>Verified Municipal Notification</span>
              <span>Just now</span>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
