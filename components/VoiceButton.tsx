'use client';

import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  onToggle: () => void;
}

export default function VoiceButton({
  isListening,
  isProcessing,
  isSpeaking,
  onToggle
}: VoiceButtonProps) {
  const getStatusColor = () => {
    if (isListening) return '#00ff00';
    if (isProcessing) return '#ffaa00';
    if (isSpeaking) return '#00aaff';
    return '#666666';
  };

  const getStatusText = () => {
    if (isListening) return 'Listening...';
    if (isProcessing) return 'Processing...';
    if (isSpeaking) return 'Speaking...';
    return 'Tap to speak';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className="relative w-32 h-32 rounded-full flex items-center justify-center focus:outline-none"
        style={{
          background: `radial-gradient(circle, ${getStatusColor()}33, ${getStatusColor()}11)`,
          border: `2px solid ${getStatusColor()}`,
        }}
      >
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              border: `2px solid ${getStatusColor()}`,
            }}
          />
        )}

        {isProcessing && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              border: `2px dashed ${getStatusColor()}`,
              borderTopColor: 'transparent',
            }}
          />
        )}

        {isSpeaking && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              border: `2px solid ${getStatusColor()}`,
            }}
          />
        )}

        <div style={{ color: getStatusColor() }}>
          {isListening ? (
            <Mic size={48} />
          ) : (
            <MicOff size={48} />
          )}
        </div>
      </motion.button>

      <p
        className="text-sm font-medium"
        style={{ color: getStatusColor() }}
      >
        {getStatusText()}
      </p>
    </div>
  );
}
