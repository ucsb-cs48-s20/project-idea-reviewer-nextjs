import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import Toast from "react-bootstrap/Toast";

const ToastContext = createContext({ showToast: null });

export function useToasts() {
  return useContext(ToastContext);
}

export function ToastProvider(props) {
  const { children } = props;

  const [toast, setToast] = useState({});
  const [showingToast, setShowingToast] = useState(false);

  const showToast = useCallback((header, body) => {
    setToast({ header, body });
    setShowingToast(true);
  }, []);

  const closeToast = useCallback(() => {
    setShowingToast(false);
  }, []);

  const providerValue = useMemo(
    () => ({
      showToast,
    }),
    []
  );

  return (
    <ToastContext.Provider value={providerValue}>
      {children}
      <Toast
        style={{ position: "fixed", top: "4rem", right: "2rem" }}
        onClose={closeToast}
        show={showingToast}
        autohide
        delay={10000}
      >
        <Toast.Header>
          <span className="mr-auto">{toast.header}</span>
        </Toast.Header>
        {toast.body && <Toast.Body>{toast.body}</Toast.Body>}
      </Toast>
    </ToastContext.Provider>
  );
}
