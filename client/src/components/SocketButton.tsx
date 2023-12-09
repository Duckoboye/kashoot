import { socket, ClientToServerEvents } from '../socket';

interface SocketButtonProps {
  eventName: keyof ClientToServerEvents;
  eventData: any;
}

const SocketButton: React.FC<SocketButtonProps> = ({ eventName, eventData }) => {
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
