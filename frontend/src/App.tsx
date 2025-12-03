import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { api } from './api'
import ErrorBoundary from "./components/ErrorBoundary";

/**
 * Root application component.
 * Currently uses the default Vite + React starter UI and
 * includes a simple connectivity check against the backend API.
 */

function App() {
  const [count, setCount] = useState(0)

  // On initial render, test the connection to the backend API
  useEffect(() => {
    api.get("/quizzes")
      .then(res => console.log("API Response:", res.data))
      .catch(err => console.error("API error:", err))
  }, [])

   return (
    <ErrorBoundary fallbackMessage="Something went wrong in the application.">
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

        {/* Status message indicating the frontend is attempting to talk to the backend API */}
        <p>React is connected to the .NET backend (check the console for API responses).</p>
      </>
    </ErrorBoundary>
  );
}

export default App
