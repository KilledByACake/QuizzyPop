import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { api } from './api'   // 👈 lagt til
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const [count, setCount] = useState(0)

  // 👇 tester kobling til backend
  useEffect(() => {
    api.get("/quizzes")
      .then(res => console.log("✅ API-answer:", res.data))
      .catch(err => console.error("❌ API-wrong:", err))
  }, [])

   return (
    <ErrorBoundary fallbackMessage="Noe gikk galt i appen.">
      <>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>

        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>

        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>

        {/* 👇 ekstra statusmelding */}
        <p>React koblet til .NET ✅ (sjekk konsollen for API-svar)</p>
      </>
    </ErrorBoundary>
  );
}

export default App
