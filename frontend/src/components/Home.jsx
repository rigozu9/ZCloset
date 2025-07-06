import React, { useEffect, useState } from 'react'

const Home = () => {
  const [message, setMessage] = useState("Ladataan...")

  useEffect(() => {
    fetch("http://localhost:8000/api/message/")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage("Virhe haussa: " + err.message))
  }, [])

  return (
    <div>
      <h2>ZCloset</h2>
      <p>{message}</p>
    </div>
  )
}

export default Home
