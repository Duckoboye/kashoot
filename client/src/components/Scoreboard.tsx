import { type Scorecard as ScorecardType } from "../socket"

const Scoreboard = ({scoreboard}: {scoreboard: ScorecardType[]}) => {
    return(
        <div id="scoreboard">
                  {scoreboard.map((entry, index) => (
        <Scorecard key={index} entry={entry} />
      ))}
        </div>
    )
}

export default Scoreboard

function Scorecard({entry}: {entry: ScorecardType}) {
    console.log(entry)
    return(
        <div className="scorecard">
            
            <div id="username">{entry.username}</div>
            <div id='score'>{entry.score} points</div>
        </div>
    )
}