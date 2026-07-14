import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

const WA_NUMBER = '919876543210';
const WA_MESSAGE = encodeURIComponent("Hi! I'm interested in discussing a project with RP Technologies.");

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setShowTooltip(true), 1000);
    const t2 = setTimeout(() => setShowTooltip(false), 5000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 16, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 16, scale: 0.9 }}
                className="relative bg-light-surface dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl px-4 py-2.5 shadow-card-dark max-w-[200px]"
              >
                <button
                  onClick={() => setShowTooltip(false)}
                  aria-label="Close tooltip"
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-light-card dark:bg-dark-border flex items-center justify-center text-light-muted dark:text-dark-muted"
                >
                  <X size={10} />
                </button>
                <p className="text-xs font-medium text-light-text dark:text-dark-text">
                  💬 Chat with us on WhatsApp
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button */}
          <motion.a
            href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 16, stiffness: 260 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:shadow-xl flex items-center justify-center relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
            <MessageCircle size={26} className="text-white relative z-10" fill="white" />
          </motion.a>
        </div>
      )}
    </AnimatePresence>
  );
}
