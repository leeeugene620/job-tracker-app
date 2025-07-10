// components/PromptModal.js
import "./PromptModal.css";

export default function PromptModal({ message, options, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          {options.map(({ label, action, type = "default" }, idx) => (
            <button
              key={idx}
              className={`modal-button ${type}`}
              onClick={() => {
                action();
                onClose();
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
