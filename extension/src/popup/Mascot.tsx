import React from 'react';
import { MascotState } from '../types';

interface MascotProps {
  state: MascotState;
}

const getMascotImage = (state: MascotState) => {
  switch (state) {
    case 'idle': return 'src/assets/mascot/idle.png';
    case 'reading': return 'src/assets/mascot/reading.png';
    case 'thinking': return 'src/assets/mascot/thinking.png';
    case 'happy': return 'src/assets/mascot/happy.png';
    case 'concerned': return 'src/assets/mascot/concerned.png';
    case 'alert': return 'src/assets/mascot/alert.png';
    default: return 'src/assets/mascot/idle.png';
  }
};

/* In a real build, Vite handles the assets. 
   We will import them to ensure they are bundled. */
import idleImg from '../assets/mascot/idle.png';
import readingImg from '../assets/mascot/reading.png';
import thinkingImg from '../assets/mascot/thinking.png';
import happyImg from '../assets/mascot/happy.png';
import concernedImg from '../assets/mascot/concerned.png';
import alertImg from '../assets/mascot/alert.png';

const images: Record<MascotState, string> = {
  idle: idleImg,
  reading: readingImg,
  thinking: thinkingImg,
  happy: happyImg,
  concerned: concernedImg,
  alert: alertImg,
};

export const Mascot: React.FC<MascotProps> = ({ state }) => {
  return (
    <div className="flex justify-center p-4">
      <img 
        src={images[state]} 
        alt={`Mascot ${state}`} 
        className="w-[12rem] h-[12rem] object-contain"
      />
    </div>
  );
};
