import { useEffect, useState } from "react";

function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinish, 1000);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`splash-container ${visible ? "fade-in" : "fade-out"}`}>
      <div className="moon"></div>
      <p className="welcome-text">
        ✨ Welcome, seeker of the Moon, of the Cards... ✨
      </p>
    </div>
  );
}

export default SplashScreen;
