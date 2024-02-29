// RoomContext.js
import { createContext, useState, ReactNode } from 'react';

interface RoomContextProps {
  roomCode: string;
  setRoomCode: React.Dispatch<React.SetStateAction<string>>;
}

export const RoomContext = createContext<RoomContextProps>({
  roomCode: '',
  setRoomCode: () => {}
});

interface RoomProviderProps {
  children: ReactNode;
}

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  const [roomCode, setRoomCode] = useState('');

  return (
    <RoomContext.Provider value={{ roomCode, setRoomCode }}>
      {children}
    </RoomContext.Provider>
  );
};
