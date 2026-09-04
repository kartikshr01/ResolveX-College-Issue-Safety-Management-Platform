import { useState } from "react";
import NotificationPanel from "./NotificationPanel";

function NotificationTest() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F4F4F2",
        padding: "40px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "fit-content",
          marginLeft: "auto",
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            width: "44px",
            height: "44px",
            border: "none",
            borderRadius: "50%",
            background: "#141414",
            color: "#FFFFFF",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ♧
        </button>

        <NotificationPanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </main>
  );
}

export default NotificationTest;