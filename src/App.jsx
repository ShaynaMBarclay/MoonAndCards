import { useState } from "react";
import axios from "axios";
import "./styles/App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openIndexes, setOpenIndexes] = useState([]);
  const [aiReading, setAiReading] = useState("");
  const [readingLoading, setReadingLoading] = useState(false); // AI reading loading state

  const handleDrawCards = async () => {
    if (!question.trim()) {
      alert("Please enter a question first.");
      return;
    }

    setLoading(true);
    setReadingLoading(true);
    setAiReading(""); 

    try {
      // Draw 3 cards
      const promises = [1, 2, 3].map(() =>
        axios.get("http://localhost:3001/cards/onecard")
      );
      const results = await Promise.all(promises);
      const drawnCards = results.map(res => res.data);
      setCards(drawnCards);
      setOpenIndexes([]);

      // Fetch AI reading
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
    setReadingLoading(false);
  };

  const toggleDescription = (index) => {
    setOpenIndexes(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
  <div className="app-container">
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

    {/* Main app content */}
    <div className="app">
      <h1>🌙 Moon and Cards 🌙</h1>

      <input
        type="text"
        placeholder="Type your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={handleDrawCards} disabled={loading}>
        {loading ? "Asking the stars...Give me a moment." : "Draw 3 Cards"}
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
              <div className="star"></div>
              <div className="star"></div>
              <div className="star"></div>
              <div className="star"></div>
              <div className="star"></div>
            </div>
          ) : (
            <div>
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
