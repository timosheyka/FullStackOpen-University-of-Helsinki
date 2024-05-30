import StatisticLine from "./StatisticLine"

const Statistics = ({ good, neutral, bad }) => {
    return (
        <table>
            <tbody>
                <StatisticLine text="good" value={good}/>
                <StatisticLine text="neutral" value={neutral}/>
                <StatisticLine text="bad" value={bad}/>
                <StatisticLine text="all" value={good + neutral + bad}/>
                <StatisticLine text="average" value={(good - bad) / (good + neutral + bad) || 0}/>
                <StatisticLine text="positive" value={(good / (good + neutral + bad)) * 100 || 0}/>
            </tbody>
        </table>
    )
}

export default Statistics