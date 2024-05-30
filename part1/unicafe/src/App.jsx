import { useState } from 'react'
import Button from './components/Button'
import Statistics from './components/Statistics'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <div>
        <h1>give feedback</h1>
        <Button onClick={() => setGood(good + 1)} text="good"/>
        <Button onClick={() => setNeutral(neutral + 1)} text="neutral"/>
        <Button onClick={() => setBad(bad + 1)} text="bad"/>
        <Button onClick={() => { setGood(0); setNeutral(0); setBad(0)} } text="reset"/>  
      </div>
      <div>
        <h1>statistics</h1>
        { good || neutral || bad ?
          <Statistics
            good={good}
            neutral={neutral}
            bad={bad}
          />
          : <p>No feedback given</p>
        }
      </div>
    </>
  )
}

export default App