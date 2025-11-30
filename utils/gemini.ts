import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiVoiceAssistant {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor(apiKey: string) {
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    }
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini API not initialized');
    }

    try {
      const fullPrompt = systemPrompt
        ? `${systemPrompt}\n\nUser: ${prompt}`
        : prompt;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  async analyzeForImprovements(
    conversation: Array<{ role: string; content: string }>,
    currentModes: string[],
    currentIntegrations: string[]
  ): Promise<string[]> {
    if (!this.model) {
      return [];
    }

    const analysisPrompt = `
You are an agentic AI system analyzer. Based on this conversation history and current capabilities, suggest specific improvements:

Current Modes: ${currentModes.join(', ')}
Current Integrations: ${currentIntegrations.join(', ')}

Conversation:
${conversation.map(m => `${m.role}: ${m.content}`).join('\n')}

Analyze the conversation and suggest:
1. New modes that would be useful
2. New API integrations or MCP servers that could help
3. UI/UX improvements
4. New features or capabilities

Return ONLY a JSON array of specific, actionable suggestions (max 5). Format:
["suggestion 1", "suggestion 2", ...]
`;

    try {
      const result = await this.model.generateContent(analysisPrompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      console.error('Analysis error:', error);
      return [];
    }
  }

  async generateNewMode(description: string): Promise<{
    name: string;
    description: string;
    systemPrompt: string;
    color: string;
    icon: string;
  } | null> {
    if (!this.model) {
      return null;
    }

    const prompt = `
Create a new assistant mode based on this description: "${description}"

Return ONLY valid JSON with this exact structure:
{
  "name": "mode name",
  "description": "brief description",
  "systemPrompt": "detailed system prompt for the AI to follow in this mode",
  "color": "hex color code",
  "icon": "lucide icon name (e.g., Code, Brain, Heart, BookOpen)"
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch (error) {
      console.error('Mode generation error:', error);
      return null;
    }
  }
}

export const getModeSystemPrompt = (mode: string): string => {
  const prompts: Record<string, string> = {
    general: 'You are a helpful, friendly AI assistant. Provide clear, concise answers to user questions.',
    code: 'You are an expert programming assistant. Help with code, debugging, algorithms, and best practices. Provide code examples when helpful.',
    creative: 'You are a creative AI assistant specializing in writing, brainstorming, and creative problem-solving. Be imaginative and inspiring.',
    analyst: 'You are a data analyst and strategic thinker. Provide analytical insights, break down complex problems, and offer data-driven recommendations.',
    health: 'You are a health and wellness assistant. Provide general health information, wellness tips, and lifestyle suggestions. Always remind users to consult healthcare professionals for medical advice.',
    learning: 'You are an educational tutor. Explain concepts clearly, provide examples, and help users learn new topics step by step.',
  };

  return prompts[mode] || prompts.general;
};
