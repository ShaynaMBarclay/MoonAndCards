import { useState } from "react";
import "./styles/App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState("");

  // Fetch random 3 cards from tarotapi.dev
  const handleDrawCards = async () => {
    if (!question.trim()) {
      alert("Please enter a question first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://tarotapi.dev/api/v1/cards/random?n=3");
      const data = await res.json();
      setCards(data.cards);
    } catch (error) {
      console.error("Error fetching tarot cards:", error);
      alert("Something went wrong while fetching cards.");
    }
    setLoading(false);
  };


  return (
    <div className="app">
      <h1>🌙 Moon and Cards</h1>

      <input
        type="text"
        placeholder="Type your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={handleDrawCards} disabled={loading}>
        {loading ? "Shuffling..." : "Draw Cards"}
      </button>

      <div className="cards">
        {cards.map((card, index) => (
          <div key={index} className="card">
            <img
              src={card.image}
              alt={card.name}
              className="card-image"
            />
            <h3>{card.name}</h3>
            <p><strong>Upright:</strong> {card.meaning_up}</p>
            <p><strong>Reversed:</strong> {card.meaning_rev}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
