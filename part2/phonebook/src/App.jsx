import { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons'

import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => { setPersons(initialPersons) })    
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const person = persons.find(person => person.name === newName)

    if (person && newNumber === person.number) {
      alert(`\'${newName}\' is already in phonebook`)
    } else if (newNumber === '') {
      alert(`please enter the number`)
    } else if (newNumber !== person.number) {
      if (window.confirm(`Replace ${person.name} number ?`)) {
        const updatedNumber = { ...person, number: newNumber }
        personsService
          .update(person.id, updatedNumber)
          .then(returnedPerson => {
            setPersons(
              persons.map((p) => {
                return p.id !== person.id ? p : returnedPerson;
              })
            )
            setNewName('')
            setNewNumber('') 
          })
          .catch(error => {
            alert(`the person '${newName}' was already deleted from server`)
            setPersons(persons.filter(n => n.id !== id))
          })
      }
    } else {
      personsService
      .create({ name: newName, number: newNumber })
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('') 
        })
        .catch(error => {
          alert(`the person '${newName}' was already deleted from server`)
          setPersons(persons.filter(n => n.id !== id))
        })
    }
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .deletePerson(person.id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== person.id));
        })
        .catch(() => {
          setPersons(persons.filter((p) => p.id !== person.id));
          alert(`Information of ${person.name} has already been removed from the server`)
        });
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter 
        filterName={filterName}
        onChange={(event) => { setFilterName(event.target.value) }}
      />
      <h3>Add a new Person</h3>
      <PersonForm
        newName={newName}
        onChangeName={(event) => { setNewName(event.target.value) }}
        newNumber={newNumber}
        onChangeNumber={(event) => { setNewNumber(event.target.value) }}
        onSubmit={addPerson}
      />
      <h3>Numbers</h3>
      <Persons 
        persons={
          filterName === '' 
            ? persons
            : persons.filter((person) => person.name.includes(filterName)) 
        }
        onClick={deletePerson}
      />
    </div>
  )
}

export default App