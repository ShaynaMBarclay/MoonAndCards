import { useState } from "react";
import axios from "axios";
import "./styles/App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openIndexes, setOpenIndexes] = useState([]);
  const [aiReading, setAiReading] = useState("");
  const [readingLoading, setReadingLoading] = useState(false); 

  const handleDrawCards = async () => {
    if (!question.trim()) {
      alert("Please enter a question first.");
      return;
    }

    setLoading(true);
    setReadingLoading(true);
    setAiReading(""); 

    try {
      const promises = [1, 2, 3].map(() =>
        axios.get("https://tarotapi-g3x5.onrender.com/cards/onecard")
      );
      const results = await Promise.all(promises);
      const drawnCards = results.map(res => res.data);
      setCards(drawnCards);
      setOpenIndexes([]);

      const readingRes = await axios.post("https://tarotapi-g3x5.onrender.com/reading", {
        question,
        cards: drawnCards,
      });

      setAiReading(readingRes.data.reading);
    } catch (error) {
      console.error(error);
      alert("The cards are busy. Please try again in a moment..");
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

    <div className="app">
      <h1>🌙 Moon and Cards 🌙</h1>

      <p> Ask the cards anything, your question, your thoughts, or whatever’s on your mind. Scroll down to discover your tarot reading.
      For entertainment purposes only. Results may not always be accurate. </p>

      <input
        type="text"
        placeholder="What will you ask of the cards?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={handleDrawCards} disabled={loading}>
        {loading ? "Asking the cards...Give me a moment." : "Draw 3 Cards"}
      </button>

      <div className="cards">
        {cards.map((card, index) => (
          <div key={index} className="card">
           <img
             src={`https://tarotapi-g3x5.onrender.com${card.image}`}
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
