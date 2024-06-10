const Total = ({ parts }) => {
    return (
        <b>total of {parts.reduce((acc, part) => acc + part.exercises, 0)}</b>
    )
}
  
export default Total