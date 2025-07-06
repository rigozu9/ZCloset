import { useEffect, useState } from 'react'

const App = () => {
  const [message, setMessage] = useState("Ladataan...")

  useEffect(() => {
    fetch("http://localhost:8000/api/message/")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage("Virhe haussa: " + err.message))
  }, [])

  return (
    <div>
      <h1>Etusivu</h1>
      <p>{message}</p>
    </div>
  )
}

export default App
