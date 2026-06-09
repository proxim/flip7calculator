import { useEffect } from 'react';
import './ErrorToast.css';

export default function ErrorToast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="error-toast" onClick={onDismiss}>
      <span className="error-toast-icon">!</span>
      <span className="error-toast-msg">{message}</span>
      <span className="error-toast-close">×</span>
    </div>
  );
}
