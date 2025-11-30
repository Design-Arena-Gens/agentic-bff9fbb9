'use client';

import { motion } from 'framer-motion';
import {
  MessageCircle,
  Code,
  Lightbulb,
  TrendingUp,
  Heart,
  BookOpen,
  Plus
} from 'lucide-react';
import { AssistantMode, CustomMode } from '@/store/useAppStore';

interface ModeSelectorProps {
  currentMode: AssistantMode;
  customModes: CustomMode[];
  onModeSelect: (mode: AssistantMode) => void;
  onAddMode: () => void;
}

const defaultModes = [
  { id: 'general', name: 'General', icon: MessageCircle, color: '#8b5cf6' },
  { id: 'code', name: 'Code', icon: Code, color: '#06b6d4' },
  { id: 'creative', name: 'Creative', icon: Lightbulb, color: '#f59e0b' },
  { id: 'analyst', name: 'Analyst', icon: TrendingUp, color: '#10b981' },
  { id: 'health', name: 'Health', icon: Heart, color: '#ef4444' },
  { id: 'learning', name: 'Learning', icon: BookOpen, color: '#3b82f6' },
];

export default function ModeSelector({
  currentMode,
  customModes,
  onModeSelect,
  onAddMode
}: ModeSelectorProps) {
  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
        Assistant Mode
      </h2>

      <div className="grid grid-cols-3 gap-3">
        {defaultModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;

          return (
            <motion.button
              key={mode.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onModeSelect(mode.id as AssistantMode)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all"
              style={{
                background: isActive
                  ? `${mode.color}22`
                  : 'rgba(255, 255, 255, 0.05)',
                border: isActive
                  ? `2px solid ${mode.color}`
                  : '2px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Icon
                size={24}
                style={{ color: isActive ? mode.color : '#888' }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: isActive ? mode.color : '#888' }}
              >
                {mode.name}
              </span>
            </motion.button>
          );
        })}

        {customModes.map((mode) => {
          const isActive = currentMode === mode.id;

          return (
            <motion.button
              key={mode.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onModeSelect(mode.id as AssistantMode)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all"
              style={{
                background: isActive
                  ? `${mode.color}22`
                  : 'rgba(255, 255, 255, 0.05)',
                border: isActive
                  ? `2px solid ${mode.color}`
                  : '2px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                className="w-6 h-6 rounded-full"
                style={{ background: mode.color }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: isActive ? mode.color : '#888' }}
              >
                {mode.name}
              </span>
            </motion.button>
          );
        })}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAddMode}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-dashed border-gray-600 hover:border-gray-400 transition-colors"
        >
          <Plus size={24} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-400">
            Add Mode
          </span>
        </motion.button>
      </div>
    </div>
  );
}
