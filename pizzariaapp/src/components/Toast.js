import React, { useEffect, useState } from 'react';

/*
 * Toast component shows a brief notification at the bottom-right.
 * Props:
 *   message (string) - text to display
 *   onClose (func)   - called after the toast disappears
 */
const Toast = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    /* Auto-dismiss after 2.5 seconds */
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="toast-overlay">
      <div className="toast-box">{message}</div>
    </div>
  );
};

export default Toast;
