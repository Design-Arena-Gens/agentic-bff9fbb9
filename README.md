# Agentic Voice Assistant

A mobile-first progressive web app featuring an AI-powered voice assistant with multiple modes and self-improving capabilities using Google's Gemini API.

## 🚀 Live Demo

**Production URL:** https://agentic-bff9fbb9.vercel.app

## ✨ Features

### 🎙️ Voice Interaction
- Real-time speech recognition
- Natural text-to-speech responses
- Visual feedback for listening/processing/speaking states

### 🎯 Multiple Assistant Modes
- **General**: All-purpose conversational assistant
- **Code**: Expert programming help with code examples
- **Creative**: Brainstorming and creative writing
- **Analyst**: Data analysis and strategic thinking
- **Health**: Wellness tips and health information
- **Learning**: Educational tutoring and explanations

### 🤖 Agentic Self-Improvement
- Analyzes conversation patterns every 5 messages
- AI-generated suggestions for new modes and features
- Create custom modes on-the-fly using natural language
- Adaptive system that learns from usage

### 🔌 Extensibility
- **MCP Server Integration**: Add Model Context Protocol servers
- **API Integrations**: Connect custom APIs for extended functionality
- Enable/disable integrations on demand

### 📱 Mobile-First Design
- Progressive Web App (PWA) ready
- Installable on mobile devices
- Touch-optimized interface
- Smooth animations and transitions
- Dark theme for comfortable viewing

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **AI**: Google Gemini API
- **Icons**: Lucide React

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file (optional): `NEXT_PUBLIC_GEMINI_API_KEY=your_key`
4. Run: `npm run dev`
5. Open http://localhost:3000

### Browser Compatibility

For best experience, use Chrome/Edge (recommended for speech recognition) or Safari (iOS).

## 📖 Usage Guide

### First Time Setup
1. Open the app
2. Tap Settings (⚙️)
3. Go to "API" tab
4. Enter your Gemini API key
5. Tap "Save API Key"

### Using Voice Commands
1. Select an assistant mode
2. Tap the microphone button
3. Speak your question
4. Wait for AI response
5. The assistant will speak back

### Creating Custom Modes
1. Tap "+" in mode selector
2. Describe the mode (e.g., "A mode for practicing Spanish")
3. AI generates new custom mode
4. Use immediately!

### Adding Integrations
- **MCP Servers**: Settings → MCP → Add server details
- **API Integrations**: Settings → APIs → Add integration details

## 🔒 Privacy & Security

- API keys stored locally
- No external data collection
- Client-side processing only

## 📱 PWA Installation

- **iOS**: Safari → Share → Add to Home Screen
- **Android**: Chrome → Menu → Install app

## 📄 License

MIT
