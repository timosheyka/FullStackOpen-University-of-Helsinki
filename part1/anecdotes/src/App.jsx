import { useState } from 'react'
import Button from '../components/Button'
import Anecdote from '../components/Anecdote'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
  const [mostVoted, setMostVoted] = useState(0)

  return (
    <>
      <div>
        <h1>Anecdote of the day</h1>
        <Anecdote anecdote={anecdotes[selected]} votes={votes[selected]}/>
        <Button 
          onClick={() => {
            const newVotes = [...votes]; newVotes[selected] += 1
            setVotes(newVotes)
            if (newVotes[selected] > votes[mostVoted]) { setMostVoted(selected) }
          }}
          text="vote"
        />
        <Button onClick={() => setSelected((selected + 1) % anecdotes.length)} text="next anecdote"/>
      </div>
      <div>
        { selected !== mostVoted
          ? <>
              <h1>Anecdote with most votes</h1>
              <Anecdote anecdote={anecdotes[mostVoted]} votes={votes[mostVoted]}/> 
            </>
          : ''
        }
      </div>
    </>
  )
}

export default App