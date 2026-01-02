import type { PracticeResult, UserProfile, ChatUsage } from "@/types";

const PROFILE_KEY = 'german_learner_profile';
const CHAT_USAGE_KEY = 'german_chat_usage';
const DAILY_CHAT_LIMIT = 5;

export function getUserProfile(): UserProfile {
  const stored = localStorage.getItem(PROFILE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    totalPractices: 0,
    averageScore: 0,
    practiceHistory: []
  };
}

export function savePracticeResult(result: PracticeResult): UserProfile {
  const profile = getUserProfile();
  
  profile.practiceHistory.push(result);
  profile.totalPractices = profile.practiceHistory.length;
  
  // Calculate new average
  const totalScore = profile.practiceHistory.reduce((sum, r) => sum + (r.score / r.totalQuestions * 10), 0);
  profile.averageScore = totalScore / profile.totalPractices;
  
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

export function getChatUsage(): ChatUsage {
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem(CHAT_USAGE_KEY);
  
  if (stored) {
    const usage: ChatUsage = JSON.parse(stored);
    // Reset if it's a new day
    if (usage.date !== today) {
      return { date: today, count: 0 };
    }
    return usage;
  }
  
  return { date: today, count: 0 };
}

export function incrementChatUsage(): ChatUsage {
  const usage = getChatUsage();
  usage.count += 1;
  localStorage.setItem(CHAT_USAGE_KEY, JSON.stringify(usage));
  return usage;
}

export function canSendChatMessage(): boolean {
  const usage = getChatUsage();
  return usage.count < DAILY_CHAT_LIMIT;
}

export function getRemainingChatMessages(): number {
  const usage = getChatUsage();
  return Math.max(0, DAILY_CHAT_LIMIT - usage.count);
}
