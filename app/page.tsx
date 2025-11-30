'use client';

import { useEffect, useState } from 'react';
import { Settings, Sparkles } from 'lucide-react';
import { useAppStore, AssistantMode } from '@/store/useAppStore';
import { GeminiVoiceAssistant, getModeSystemPrompt } from '@/utils/gemini';
import { SpeechManager } from '@/utils/speech';
import VoiceButton from '@/components/VoiceButton';
import ModeSelector from '@/components/ModeSelector';
import ChatHistory from '@/components/ChatHistory';
import SettingsPanel from '@/components/SettingsPanel';
import { motion } from 'framer-motion';

export default function Home() {
  const {
    isListening,
    isProcessing,
    isSpeaking,
    currentMode,
    customModes,
    mcpServers,
    apiIntegrations,
    messages,
    geminiApiKey,
    improvementSuggestions,
    setListening,
    setProcessing,
    setSpeaking,
    setCurrentMode,
    addCustomMode,
    addMCPServer,
    removeMCPServer,
    toggleMCPServer,
    addAPIIntegration,
    removeAPIIntegration,
    toggleAPIIntegration,
    addMessage,
    setGeminiApiKey,
    addImprovementSuggestion,
    clearImprovementSuggestions
  } = useAppStore();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [geminiAssistant, setGeminiAssistant] = useState<GeminiVoiceAssistant | null>(null);
  const [speechManager, setSpeechManager] = useState<SpeechManager | null>(null);
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);

  useEffect(() => {
    const speech = new SpeechManager();
    setSpeechManager(speech);

    if (!speech.isSpeechSupported()) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
    }

    // Check for API key
    if (!geminiApiKey) {
      setShowApiKeyPrompt(true);
    } else {
      setGeminiAssistant(new GeminiVoiceAssistant(geminiApiKey));
    }
  }, [geminiApiKey]);

  useEffect(() => {
    // Analyze conversation every 5 messages for improvements
    if (messages.length > 0 && messages.length % 5 === 0) {
      analyzeForImprovements();
    }
  }, [messages.length]);

  const analyzeForImprovements = async () => {
    if (!geminiAssistant) return;

    try {
      const suggestions = await geminiAssistant.analyzeForImprovements(
        messages.map(m => ({ role: m.role, content: m.content })),
        [currentMode, ...customModes.map(m => m.name)],
        [
          ...mcpServers.map(s => s.name),
          ...apiIntegrations.map(a => a.name)
        ]
      );

      suggestions.forEach(s => addImprovementSuggestion(s));
    } catch (error) {
      console.error('Failed to analyze for improvements:', error);
    }
  };

  const handleVoiceToggle = () => {
    if (!speechManager || !geminiAssistant) {
      if (!geminiApiKey) {
        setSettingsOpen(true);
      }
      return;
    }

    if (isListening) {
      speechManager.stopListening();
      setListening(false);
    } else {
      setListening(true);
      speechManager.startListening(
        async (transcript) => {
          setListening(false);
          setProcessing(true);

          // Add user message
          addMessage({ role: 'user', content: transcript });

          try {
            // Get system prompt based on current mode
            let systemPrompt = getModeSystemPrompt(currentMode);

            // If custom mode, use its system prompt
            const customMode = customModes.find(m => m.id === currentMode);
            if (customMode) {
              systemPrompt = customMode.systemPrompt;
            }

            // Generate response
            const response = await geminiAssistant.generateText(
              transcript,
              systemPrompt
            );

            // Add assistant message
            addMessage({ role: 'assistant', content: response });

            setProcessing(false);
            setSpeaking(true);

            // Speak the response
            speechManager.speak(response, () => {
              setSpeaking(false);
            });
          } catch (error) {
            console.error('Error processing request:', error);
            setProcessing(false);
            addMessage({
              role: 'assistant',
              content: 'Sorry, I encountered an error processing your request.'
            });
          }
        },
        (error) => {
          setListening(false);
          console.error('Speech recognition error:', error);
        }
      );
    }
  };

  const handleAddMode = async () => {
    if (!geminiAssistant) return;

    const description = prompt('Describe the new assistant mode you want to create:');
    if (!description) return;

    try {
      const newMode = await geminiAssistant.generateNewMode(description);
      if (newMode) {
        addCustomMode({
          id: `custom-${Date.now()}`,
          ...newMode
        });
        alert(`New mode "${newMode.name}" created successfully!`);
      }
    } catch (error) {
      console.error('Failed to create new mode:', error);
      alert('Failed to create new mode. Please try again.');
    }
  };

  const handleApplyImprovement = async (suggestion: string) => {
    // For now, just show the suggestion
    alert(`Improvement suggestion:\n\n${suggestion}\n\nThis feature will be implemented in future updates.`);
  };

  const handleSaveApiKey = (key: string) => {
    setGeminiApiKey(key);
    setGeminiAssistant(new GeminiVoiceAssistant(key));
    setShowApiKeyPrompt(false);
    alert('API key saved! You can now use voice commands.');
  };

  return (
    <main className="h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <Sparkles size={28} className="text-purple-500" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold">Agentic Assistant</h1>
            <p className="text-xs text-gray-400">AI-Powered Voice Assistant</p>
          </div>
        </div>
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Settings size={24} />
        </button>
      </div>

      {/* API Key Prompt */}
      {showApiKeyPrompt && (
        <div className="bg-yellow-900/30 border border-yellow-600 p-4 m-4 rounded-lg">
          <p className="text-sm text-yellow-200 mb-2">
            Please add your Gemini API key in settings to start using the assistant.
          </p>
          <button
            onClick={() => setSettingsOpen(true)}
            className="text-sm text-yellow-400 hover:underline"
          >
            Open Settings
          </button>
        </div>
      )}

      {/* Mode Selector */}
      <ModeSelector
        currentMode={currentMode}
        customModes={customModes}
        onModeSelect={setCurrentMode}
        onAddMode={handleAddMode}
      />

      {/* Chat History */}
      <ChatHistory messages={messages} />

      {/* Voice Button */}
      <div className="p-8 border-t border-gray-800 flex justify-center">
        <VoiceButton
          isListening={isListening}
          isProcessing={isProcessing}
          isSpeaking={isSpeaking}
          onToggle={handleVoiceToggle}
        />
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        geminiApiKey={geminiApiKey}
        mcpServers={mcpServers}
        apiIntegrations={apiIntegrations}
        improvementSuggestions={improvementSuggestions}
        onSaveApiKey={handleSaveApiKey}
        onAddMCPServer={addMCPServer}
        onRemoveMCPServer={removeMCPServer}
        onToggleMCPServer={toggleMCPServer}
        onAddAPIIntegration={addAPIIntegration}
        onRemoveAPIIntegration={removeAPIIntegration}
        onToggleAPIIntegration={toggleAPIIntegration}
        onApplyImprovement={handleApplyImprovement}
      />
    </main>
  );
}
