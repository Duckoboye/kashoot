// SocketButton.js
import { socket } from '../socket';
const SocketButton = ({ eventName, eventData }) => {
  const emitEvent = () => {
    socket.emit(eventName, eventData);
  };

  return (
    <button onClick={emitEvent}>
      Emit {eventName}
    </button>
  );
};

export default SocketButton;
