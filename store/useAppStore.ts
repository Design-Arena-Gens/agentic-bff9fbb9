import { create } from 'zustand';

export type AssistantMode =
  | 'general'
  | 'code'
  | 'creative'
  | 'analyst'
  | 'health'
  | 'learning'
  | 'custom';

export interface CustomMode {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  color: string;
  icon: string;
}

export interface MCPServer {
  id: string;
  name: string;
  endpoint: string;
  apiKey?: string;
  enabled: boolean;
}

export interface APIIntegration {
  id: string;
  name: string;
  endpoint: string;
  apiKey: string;
  enabled: boolean;
  headers?: Record<string, string>;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AppState {
  // Voice state
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;

  // Mode state
  currentMode: AssistantMode;
  customModes: CustomMode[];

  // Integration state
  mcpServers: MCPServer[];
  apiIntegrations: APIIntegration[];

  // Messages
  messages: Message[];

  // API Key
  geminiApiKey: string;

  // Agentic improvement
  improvementSuggestions: string[];

  // Actions
  setListening: (listening: boolean) => void;
  setProcessing: (processing: boolean) => void;
  setSpeaking: (speaking: boolean) => void;
  setCurrentMode: (mode: AssistantMode) => void;
  addCustomMode: (mode: CustomMode) => void;
  removeCustomMode: (id: string) => void;
  updateCustomMode: (id: string, updates: Partial<CustomMode>) => void;
  addMCPServer: (server: MCPServer) => void;
  removeMCPServer: (id: string) => void;
  toggleMCPServer: (id: string) => void;
  addAPIIntegration: (integration: APIIntegration) => void;
  removeAPIIntegration: (id: string) => void;
  toggleAPIIntegration: (id: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setGeminiApiKey: (key: string) => void;
  addImprovementSuggestion: (suggestion: string) => void;
  clearImprovementSuggestions: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isListening: false,
  isProcessing: false,
  isSpeaking: false,
  currentMode: 'general',
  customModes: [],
  mcpServers: [],
  apiIntegrations: [],
  messages: [],
  geminiApiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
  improvementSuggestions: [],

  setListening: (listening) => set({ isListening: listening }),
  setProcessing: (processing) => set({ isProcessing: processing }),
  setSpeaking: (speaking) => set({ isSpeaking: speaking }),
  setCurrentMode: (mode) => set({ currentMode: mode }),

  addCustomMode: (mode) => set((state) => ({
    customModes: [...state.customModes, mode]
  })),

  removeCustomMode: (id) => set((state) => ({
    customModes: state.customModes.filter(m => m.id !== id)
  })),

  updateCustomMode: (id, updates) => set((state) => ({
    customModes: state.customModes.map(m =>
      m.id === id ? { ...m, ...updates } : m
    )
  })),

  addMCPServer: (server) => set((state) => ({
    mcpServers: [...state.mcpServers, server]
  })),

  removeMCPServer: (id) => set((state) => ({
    mcpServers: state.mcpServers.filter(s => s.id !== id)
  })),

  toggleMCPServer: (id) => set((state) => ({
    mcpServers: state.mcpServers.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    )
  })),

  addAPIIntegration: (integration) => set((state) => ({
    apiIntegrations: [...state.apiIntegrations, integration]
  })),

  removeAPIIntegration: (id) => set((state) => ({
    apiIntegrations: state.apiIntegrations.filter(i => i.id !== id)
  })),

  toggleAPIIntegration: (id) => set((state) => ({
    apiIntegrations: state.apiIntegrations.map(i =>
      i.id === id ? { ...i, enabled: !i.enabled } : i
    )
  })),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: Date.now().toString(),
      timestamp: Date.now()
    }]
  })),

  clearMessages: () => set({ messages: [] }),

  setGeminiApiKey: (key) => set({ geminiApiKey: key }),

  addImprovementSuggestion: (suggestion) => set((state) => ({
    improvementSuggestions: [...state.improvementSuggestions, suggestion]
  })),

  clearImprovementSuggestions: () => set({ improvementSuggestions: [] })
}));
