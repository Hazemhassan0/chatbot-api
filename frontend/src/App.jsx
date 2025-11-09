import Chat from "./components/Chat";

function App() {
  return (
    <div className="app-container" style={{
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f2f4f7",
      minHeight: "100vh",
      padding: "20px"
    }}>
      <h1 style={{ textAlign: "center" }}>🧠 ChatGPT + 🎨 Image Generator</h1>
      <Chat />
    </div>
  );
}

export default App;