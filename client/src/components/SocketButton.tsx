import { ReactNode } from 'react';
import { socket, ClientToServerEvents } from '../socket';

interface SocketButtonProps {
  eventName: keyof ClientToServerEvents;
  eventData?: any;
  children?: ReactNode
}

const SocketButton: React.FC<SocketButtonProps> = ({ eventName, eventData, children }) => {
  const emitEvent = () => {
    socket.emit(eventName, eventData);
  };

  return (
    <button onClick={emitEvent}>
      {children}
    </button>
  );
};

export default SocketButton;
