'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  X,
  Key,
  Server,
  Plug,
  Sparkles,
  Trash2,
  Plus,
  Power
} from 'lucide-react';
import { MCPServer, APIIntegration } from '@/store/useAppStore';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  geminiApiKey: string;
  mcpServers: MCPServer[];
  apiIntegrations: APIIntegration[];
  improvementSuggestions: string[];
  onSaveApiKey: (key: string) => void;
  onAddMCPServer: (server: MCPServer) => void;
  onRemoveMCPServer: (id: string) => void;
  onToggleMCPServer: (id: string) => void;
  onAddAPIIntegration: (integration: APIIntegration) => void;
  onRemoveAPIIntegration: (id: string) => void;
  onToggleAPIIntegration: (id: string) => void;
  onApplyImprovement: (suggestion: string) => void;
}

export default function SettingsPanel({
  isOpen,
  onClose,
  geminiApiKey,
  mcpServers,
  apiIntegrations,
  improvementSuggestions,
  onSaveApiKey,
  onAddMCPServer,
  onRemoveMCPServer,
  onToggleMCPServer,
  onAddAPIIntegration,
  onRemoveAPIIntegration,
  onToggleAPIIntegration,
  onApplyImprovement
}: SettingsPanelProps) {
  const [apiKey, setApiKey] = useState(geminiApiKey);
  const [activeTab, setActiveTab] = useState<'api' | 'mcp' | 'integrations' | 'improvements'>('api');

  // MCP Server form
  const [mcpName, setMcpName] = useState('');
  const [mcpEndpoint, setMcpEndpoint] = useState('');
  const [mcpApiKey, setMcpApiKey] = useState('');

  // API Integration form
  const [apiName, setApiName] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [apiApiKey, setApiApiKey] = useState('');

  const handleAddMCPServer = () => {
    if (mcpName && mcpEndpoint) {
      onAddMCPServer({
        id: Date.now().toString(),
        name: mcpName,
        endpoint: mcpEndpoint,
        apiKey: mcpApiKey || undefined,
        enabled: true
      });
      setMcpName('');
      setMcpEndpoint('');
      setMcpApiKey('');
    }
  };

  const handleAddAPIIntegration = () => {
    if (apiName && apiEndpoint && apiApiKey) {
      onAddAPIIntegration({
        id: Date.now().toString(),
        name: apiName,
        endpoint: apiEndpoint,
        apiKey: apiApiKey,
        enabled: true
      });
      setApiName('');
      setApiEndpoint('');
      setApiApiKey('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings size={24} className="text-purple-500" />
                <h2 className="text-xl font-bold">Settings</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800">
              {[
                { id: 'api', label: 'API', icon: Key },
                { id: 'mcp', label: 'MCP', icon: Server },
                { id: 'integrations', label: 'APIs', icon: Plug },
                { id: 'improvements', label: 'AI', icon: Sparkles }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-500'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 space-y-6">
              {/* API Key Tab */}
              {activeTab === 'api' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Gemini API Key
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your Gemini API key"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                    />
                  </div>
                  <button
                    onClick={() => onSaveApiKey(apiKey)}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                  >
                    Save API Key
                  </button>
                  <p className="text-xs text-gray-500">
                    Get your API key from{' '}
                    <a
                      href="https://makersuite.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>
              )}

              {/* MCP Servers Tab */}
              {activeTab === 'mcp' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={mcpName}
                      onChange={(e) => setMcpName(e.target.value)}
                      placeholder="Server name"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                    />
                    <input
                      type="text"
                      value={mcpEndpoint}
                      onChange={(e) => setMcpEndpoint(e.target.value)}
                      placeholder="Endpoint URL"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                    />
                    <input
                      type="password"
                      value={mcpApiKey}
                      onChange={(e) => setMcpApiKey(e.target.value)}
                      placeholder="API Key (optional)"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                    />
                    <button
                      onClick={handleAddMCPServer}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Add MCP Server
                    </button>
                  </div>

                  <div className="space-y-2">
                    {mcpServers.map((server) => (
                      <div
                        key={server.id}
                        className="p-3 bg-gray-800 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{server.name}</p>
                          <p className="text-xs text-gray-400">{server.endpoint}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onToggleMCPServer(server.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              server.enabled
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                          >
                            <Power size={16} />
                          </button>
                          <button
                            onClick={() => onRemoveMCPServer(server.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* API Integrations Tab */}
              {activeTab === 'integrations' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={apiName}
                      onChange={(e) => setApiName(e.target.value)}
                      placeholder="API name"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                    />
                    <input
                      type="text"
                      value={apiEndpoint}
                      onChange={(e) => setApiEndpoint(e.target.value)}
                      placeholder="Endpoint URL"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                    />
                    <input
                      type="password"
                      value={apiApiKey}
                      onChange={(e) => setApiApiKey(e.target.value)}
                      placeholder="API Key"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                    />
                    <button
                      onClick={handleAddAPIIntegration}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Add API Integration
                    </button>
                  </div>

                  <div className="space-y-2">
                    {apiIntegrations.map((integration) => (
                      <div
                        key={integration.id}
                        className="p-3 bg-gray-800 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{integration.name}</p>
                          <p className="text-xs text-gray-400">{integration.endpoint}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onToggleAPIIntegration(integration.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              integration.enabled
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                          >
                            <Power size={16} />
                          </button>
                          <button
                            onClick={() => onRemoveAPIIntegration(integration.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Improvements Tab */}
              {activeTab === 'improvements' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">
                    AI-generated suggestions to improve your assistant based on usage patterns
                  </p>

                  {improvementSuggestions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No suggestions yet. Keep using the assistant!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {improvementSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-800 rounded-lg space-y-2"
                        >
                          <p className="text-sm">{suggestion}</p>
                          <button
                            onClick={() => onApplyImprovement(suggestion)}
                            className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            Apply Suggestion
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
