const PersonForm = ({ newName, onChangeName, newNumber, onChangeNumber, onSubmit}) => {
    return (
        <form onSubmit={onSubmit}>
            <div>
                <div>Name: <input value={newName} onChange={onChangeName}/></div>
                <div>Number: <input value={newNumber} onChange={onChangeNumber}/></div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm