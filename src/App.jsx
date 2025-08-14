import { useState } from "react";
import axios from "axios";
import "./styles/App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDrawCards = async () => {
    if (!question.trim()) {
      alert("Please enter a question first.");
      return;
    }

    setLoading(true);
    try {
      // Draw 3 cards by calling /onecard three times
      const promises = [1, 2, 3].map(() =>
        axios.get("http://localhost:3001/cards/onecard")
      );
      const results = await Promise.all(promises);
      setCards(results.map(res => res.data));
    } catch (error) {
      console.error(error);
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
        {loading ? "Shuffling..." : "Draw 3 Cards"}
      </button>

      <div className="cards">
        {cards.map((card, index) => (
          <div key={index} className="card">
            <img
              src={`http://localhost:3001${card.image}`} 
              alt={card.name}
              className="card-image"
            />
            <h3>{card.name}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
