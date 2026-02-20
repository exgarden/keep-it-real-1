import React from 'react';
import { HandwrittenCaption } from './HandwrittenCaption';

interface PolaroidCardProps {
  imageSrc: string;
  caption?: string;
  isDeveloping?: boolean;
  timestamp?: number;
  isMinted?: boolean;
  rotation?: number;
  className?: string;
  onCaptionChange?: (val: string) => void;
  editable?: boolean;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({
  imageSrc,
  caption = "",
  isDeveloping = false,
  timestamp,
  isMinted = false,
  rotation = (Math.random() - 0.5) * 4,
  className = "",
  onCaptionChange,
  editable = false
}) => {
  return (
    <div
      className={`polaroid-card paper-texture transition-transform duration-500 scale-100 hover:scale-[1.02] ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        boxShadow: `0 20px 40px -10px rgba(0,0,0,0.1), 0 10px 20px -5px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)`
      }}
    >
      <div className="polaroid-image-container">
        <img
          src={imageSrc}
          className={`w-full h-full object-cover ${isDeveloping ? 'developing-effect' : ''}`}
          alt="Moment"
        />
        <div className={`verified-stamp ${isMinted ? 'active' : ''}`}>
          Verified
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center px-4">
        {editable ? (
          <HandwrittenCaption
            value={caption}
            onChange={(val) => onCaptionChange?.(val)}
            placeholder="Tap to write..."
            className="w-full"
          />
        ) : (
          <p className="font-typewriter text-xl text-[#2A2A2A] text-center min-h-[1.2rem] leading-relaxed break-words w-full px-2 opacity-90">
            {caption}
          </p>
        )}

        {timestamp && (
          <p className="mt-6 text-[8px] uppercase tracking-[0.2em] text-[#A09E96]/60 font-bold font-typewriter">
            {new Date(timestamp).toLocaleDateString()} // {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
};
