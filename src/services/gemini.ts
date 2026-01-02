import { supabase } from "@/integrations/supabase/client";
import type { WordData, Question } from "@/types";

export async function lookupWord(word: string): Promise<WordData> {
  const { data, error } = await supabase.functions.invoke('gemini-word-lookup', {
    body: { word }
  });

  if (error) {
    console.error('Word lookup error:', error);
    throw new Error(error.message || 'Failed to lookup word');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as WordData;
}

export async function generatePracticeQuestions(wordData: WordData): Promise<Question[]> {
  const { data, error } = await supabase.functions.invoke('gemini-practice', {
    body: {
      word: wordData.word,
      turkishMeaning: wordData.turkishMeaning,
      englishMeaning: wordData.englishMeaning,
      article: wordData.article,
      pluralForm: wordData.pluralForm,
      partOfSpeech: wordData.partOfSpeech
    }
  });

  if (error) {
    console.error('Practice generation error:', error);
    throw new Error(error.message || 'Failed to generate questions');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data.questions as Question[];
}

export async function sendChatMessage(message: string, conversationHistory: { role: string; content: string }[]): Promise<string> {
  const { data, error } = await supabase.functions.invoke('gemini-chat', {
    body: { message, conversationHistory }
  });

  if (error) {
    console.error('Chat error:', error);
    throw new Error(error.message || 'Failed to send message');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data.response as string;
}
