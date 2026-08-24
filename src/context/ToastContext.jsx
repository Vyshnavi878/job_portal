import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((messageOrObj, opts = {}) => {
    toastIdCounter += 1;
    const id = toastIdCounter;

    let message = '';
    let title = '';
    let type = 'info';
    let duration = 4000;

    if (typeof messageOrObj === 'object' && messageOrObj !== null) {
      message = messageOrObj.message || '';
      title = messageOrObj.title || '';
      type = messageOrObj.type || 'info';
      duration = messageOrObj.duration !== undefined ? messageOrObj.duration : 4000;
    } else {
      message = String(messageOrObj || '');
      title = opts.title || '';
      type = opts.type || 'info';
      duration = opts.duration !== undefined ? opts.duration : 4000;
    }

    setToasts((prev) => [...prev, { id, message, title, type, duration }]);
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);

  const success = useCallback((msg, opts) => addToast(msg, { ...opts, type: 'success' }), [addToast]);
  const error   = useCallback((msg, opts) => addToast(msg, { ...opts, type: 'error'   }), [addToast]);
  const warning = useCallback((msg, opts) => addToast(msg, { ...opts, type: 'warning' }), [addToast]);
  const info    = useCallback((msg, opts) => addToast(msg, { ...opts, type: 'info'    }), [addToast]);

  // Create callable toast helper with attached methods
  const toastFn = useCallback((msgOrObj, opts) => addToast(msgOrObj, opts), [addToast]);
  toastFn.success = success;
  toastFn.error = error;
  toastFn.warning = warning;
  toastFn.info = info;
  toastFn.dismiss = dismiss;

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      toast: toastFn,
      success,
      error,
      warning,
      info,
      dismiss
    }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');

  // If someone calls useToast() directly as a function like `const toast = useToast(); toast('...')`
  // we proxy the function or return the rich context object with callable fallback
  const handler = {
    get(target, prop) {
      if (prop in target.toast) {
        return target.toast[prop];
      }
      return target[prop];
    },
    apply(target, thisArg, argArray) {
      return target.toast.apply(thisArg, argArray);
    }
  };

  return new Proxy(ctx.toast, {
    get(target, prop) {
      if (prop in ctx) {
        return ctx[prop];
      }
      return target[prop];
    }
  });
}
