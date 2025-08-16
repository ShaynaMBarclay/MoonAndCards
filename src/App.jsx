import { useState } from "react";
import "./styles/App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState([]);
  const [visibleCards, setVisibleCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openIndexes, setOpenIndexes] = useState([]);
  const [aiReading, setAiReading] = useState("");
  const [readingLoading, setReadingLoading] = useState(false);

  const handleDrawCards = async () => {
    if (!question.trim()) {
      alert("Please enter a question first.");
      return;
    }

    if (loading) return;

    setLoading(true);
    setReadingLoading(true);
    setAiReading("");
    setCards([]);
    setVisibleCards([]);

    try {
      const url = `${import.meta.env.VITE_API_URL}/cards`;
      const response = await fetch(url);

      const text = await response.text();
      let deck;
      try {
        deck = JSON.parse(text);
      } catch {
        console.error("Failed to parse cards JSON. Got:", text);
        alert("Error loading cards. Please check your backend URL.");
        return;
      }

      // --- Functional draw without duplicates ---
      const drawCards = (deck, count) => {
        const shuffled = [...deck].sort(() => Math.random() - 0.5); // shuffle deck
        return shuffled.slice(0, count); // pick first `count` cards
      };

      const drawn = drawCards(deck, 3); // draw 3 unique cards
      setCards(drawn);

      drawn.forEach((card, index) => {
        setTimeout(() => {
          setVisibleCards((prev) => [...prev, card]);
        }, index * 800);
      });

      // --- Fetch AI reading ---
      const readingResponse = await fetch(`${import.meta.env.VITE_API_URL}/reading`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, cards: drawn }),
      });

      const readingData = await readingResponse.json();
      setAiReading(readingData.reading);

    } catch (error) {
      console.error("Error drawing cards:", error);
      alert("Something went wrong, please try again later.");
    } finally {
      setLoading(false);
      setReadingLoading(false);
    }
  };

  const toggleDescription = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="app-container">
      {/* glittering stars background */}
      <div className="glittering-stars">
        {[...Array(50)].map((_, i) => {
          const style = {
            top: Math.random() * 100 + "vh",
            left: Math.random() * 100 + "vw",
            width: 8 + Math.random() * 8 + "px",
            height: 8 + Math.random() * 8 + "px",
            animationDuration: 1 + Math.random() * 2 + "s",
            animationDelay: Math.random() * 5 + "s",
          };
          return <div key={i} className="star" style={style}></div>;
        })}
      </div>

      <div className="app">
        <h1>🌙 Moon and Cards 🌙</h1>

        <p>
          Ask the cards anything. Scroll down to discover your tarot reading.
          <br />
          <em>For entertainment purposes only.</em>
        </p>

        <input
          type="text"
          placeholder="What will you ask of the cards?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button onClick={handleDrawCards} disabled={loading}>
          {loading ? "Asking the cards..." : "Draw 3 Cards"}
        </button>

        <div className="cards">
          {visibleCards.map((card, index) => (
            <div key={index} className="card fade-in">
              <img
                src={`${import.meta.env.VITE_API_URL}${card.image}`}
                alt={card.name}
                className="card-image"
              />
              <h3>{card.name}</h3>
              <button className="toggle-btn" onClick={() => toggleDescription(index)}>
                {openIndexes.includes(index) ? "Hide Description" : "Show Description"}
              </button>
              {openIndexes.includes(index) && card.description && (
                <div className="description-container open">
                  <p className="description">{card.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {(readingLoading || aiReading) && (
          <div className="ai-reading">
            {readingLoading ? (
              <div className="spinner">
                {[...Array(5)].map((_, i) => <div key={i} className="star"></div>)}
              </div>
            ) : (
              <div className="ai-text">
                <h2>✨ Your Tarot Reading:</h2>
                <p>{aiReading}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
