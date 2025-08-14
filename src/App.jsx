import { useState } from "react";
import axios from "axios";
import "./styles/App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openIndexes, setOpenIndexes] = useState([]);
  const [aiReading, setAiReading] = useState("");

  const handleDrawCards = async () => {
    if (!question.trim()) {
      alert("Please enter a question first.");
      return;
    }

    setLoading(true);
    setAiReading(""); 
    try {
      const promises = [1, 2, 3].map(() =>
        axios.get("http://localhost:3001/cards/onecard")
      );
      const results = await Promise.all(promises);
      const drawnCards = results.map(res => res.data);
      setCards(drawnCards);
      setOpenIndexes([]);

      const readingRes = await axios.post("http://localhost:3001/reading", {
        question,
        cards: drawnCards,
      });

      setAiReading(readingRes.data.reading);

    } catch (error) {
      console.error(error);
      alert("Something went wrong while fetching cards or AI reading.");
    }
    setLoading(false);
  };

  const toggleDescription = (index) => {
    setOpenIndexes(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="app">
      <h1>🌙 Moon and Cards 🌙</h1>

      <input
        type="text"
        placeholder="Type your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={handleDrawCards} disabled={loading}>
        {loading ? "Loading response, please wait..." : "Draw 3 Cards"}
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

            <button 
              className="toggle-btn" 
              onClick={() => toggleDescription(index)}
            >
              {openIndexes.includes(index) ? "Hide Description" : "Show Description"}
            </button>

            <div 
              className={`description-container ${openIndexes.includes(index) ? "open" : ""}`}
            >
              <p className="description">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      {aiReading && (
        <div className="ai-reading">
          <h2>✨Tarot Reading:</h2>
          <p>{aiReading}</p>
        </div>
      )}
    </div>
  );
}

export default App;
