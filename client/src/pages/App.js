import '../index.css';
import logo from '../pic/logo.svg';
import LoginButton from '../components/LoginButton';

function App() {
	return (
		<div className="App">
			<header>
				<img className="logo" src={logo} alt="logo" />
			</header>
			<div className="knappar">
				<LoginButton></LoginButton>
			</div>

			<script src="/socket.io/socket.io.js"></script>
			<script>var socket = io();</script>
		</div>
	);
}

export default App;
