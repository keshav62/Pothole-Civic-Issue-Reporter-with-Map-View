import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <section>
        <h1>Civic Connect</h1>

        <p>
          Report and track civic issues in your area.
        </p>

        <button
          type="button"
          onClick={() => setCount((count) => count + 1)}
        >
          Reports: {count}
        </button>
      </section>
    </main>
  )
}

export default App