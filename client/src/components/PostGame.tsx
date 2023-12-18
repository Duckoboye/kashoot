import Scoreboard from './Scoreboard'
import { Scorecard } from '../socket'
import './PostGame.css'
const PostGame = ({scoreboard, winner}: {scoreboard: Scorecard[], winner: string}) => {
    function Winner() {
        const winnerUser: Scorecard | undefined = scoreboard.find(user => user.userId == winner)
        if (winnerUser == undefined) return
        return (
            <div id='winnerbox'>
                <div id='label'>Winner</div>
                <div id='username'>{winnerUser.username}</div>
                <div id='score'>{winnerUser?winnerUser.score:'how'} points</div>
            </div>
        )
    }
    // function Scoreboard() {
    //     return(
    //         <div id='scoreboard'>
    //             <Scorecard></Scorecard>
    //         </div>
    //     )
    // }
    function Scorecard() {
        return(
            <div className="scorecard">
                <div id="username">username</div>
                <div id='score'>12 points</div>
            </div>
        )
    }
    return (
        <div id="postgame">
            <Winner></Winner>
            <Scoreboard scoreboard={scoreboard}></Scoreboard>
        </div>
    )
}
export default PostGame

