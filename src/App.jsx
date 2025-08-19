import { useState } from "react";
import SplashScreen from "./SplashScreen";
import MainApp from "./MainApp";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <MainApp />
      )}
    </>
  );
}

export default App;
