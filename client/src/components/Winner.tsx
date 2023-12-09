interface WinnerProps {
    winner: string
}

const Winner: React.FC<WinnerProps> = ({winner}) => {
    return(
        <h1>winner: {winner}</h1>
    )
}

export default Winner