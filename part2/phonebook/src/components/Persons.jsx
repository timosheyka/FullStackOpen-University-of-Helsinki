const Persons = ({ persons, onClick }) => {
    return (
        <ul>
            {persons.
                map(person =>
                    <div key={person.name}>
                        <span >{person.name} {person.number}</span>
                        <button onClick={() => { onClick(person) }}>delete</button>
                    </div> 
            )}
        </ul>
    )
}

export default Persons