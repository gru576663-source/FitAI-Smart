// FitAI Smart Utility & Calculation Helpers

/**
 * Calculates BMR, TDEE, and Target Macros based on user biometrics and primary goal.
 */
export function calculateMetabolicTargets(profile) {
  const age = Number(profile.age) || 28;
  const weightKg = Number(profile.weightKg) || 72;
  const heightCm = Number(profile.heightCm) || 175;
  const gender = profile.gender || 'other';
  const activityLevel = profile.activityLevel || 'moderate';
  const goal = profile.primaryGoal || 'muscle';

  // Mifflin-St Jeor Equation for Basal Metabolic Rate (BMR)
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else if (gender === 'female') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
    // Neutral average
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 78;
  }

  // Activity multiplier
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    athlete: 1.9
  };
  const multiplier = activityMultipliers[activityLevel] || 1.55;
  const tdee = Math.round(bmr * multiplier);

  // Goal calorie adjustment & macro split
  let targetCalories = tdee;
  let proteinRatio = 0.3;
  let carbRatio = 0.45;
  let fatRatio = 0.25;

  if (goal === 'weight_loss') {
    targetCalories = Math.round(tdee - 450); // Safe sustainable deficit
    proteinRatio = 0.35; // Higher protein for muscle retention
    carbRatio = 0.35;
    fatRatio = 0.30;
  } else if (goal === 'muscle') {
    targetCalories = Math.round(tdee + 300); // Clean surplus
    proteinRatio = 0.30;
    carbRatio = 0.50;
    fatRatio = 0.20;
  } else if (goal === 'endurance') {
    targetCalories = Math.round(tdee + 150);
    proteinRatio = 0.25;
    carbRatio = 0.55;
    fatRatio = 0.20;
  } else if (goal === 'tone') {
    targetCalories = Math.round(tdee - 200);
    proteinRatio = 0.32;
    carbRatio = 0.40;
    fatRatio = 0.28;
  }

  const targetProtein = Math.round((targetCalories * proteinRatio) / 4); // 4 kcal/g
  const targetCarbs = Math.round((targetCalories * carbRatio) / 4);     // 4 kcal/g
  const targetFat = Math.round((targetCalories * fatRatio) / 9);        // 9 kcal/g

  // Daily water target in mL: ~35-40ml per kg + extra for active workout
  const waterTarget = Math.round((weightKg * 38) + (activityLevel === 'athlete' || activityLevel === 'active' ? 750 : 350));

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    targetProtein,
    targetCarbs,
    targetFat,
    waterTarget
  };
}

/**
 * Formats time (e.g., 65 sec -> "01:05")
 */
export function formatSeconds(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formats time of day greeting
 */
export function getTimeGreeting(name = 'Athlete') {
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  let emoji = '☀️';
  let quote = 'Your metabolic engine is primed for high performance today.';

  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
    emoji = '⚡';
    quote = 'Keep your momentum sharp with optimal mid-day nutrition.';
  } else if (hour >= 17 && hour < 21) {
    greeting = 'Good evening';
    emoji = '🔥';
    quote = 'Time to wrap up your day with recovery and cellular rejuvenation.';
  } else if (hour >= 21 || hour < 5) {
    greeting = 'Good night';
    emoji = '🌙';
    quote = 'Rest is where your adaptations and growth occur. Prioritize deep sleep.';
  }

  return { greeting: `${greeting}, ${name}!`, emoji, quote };
}

/**
 * Text-to-Speech (TTS) synthesizer helper for AI Coach reading aloud
 */
export function speakText(text, onEnd) {
  if (!('speechSynthesis' in window)) return null;

  window.speechSynthesis.cancel(); // Stop ongoing speech

  // Strip markdown formatting for cleaner audio
  const cleanText = text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s?/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 1.05;
  utterance.pitch = 1.0;

  // Try to find a natural sounding English voice
  const voices = window.speechSynthesis.getVoices();
  const naturalVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Siri')) && v.lang.startsWith('en')) || voices.find(v => v.lang.startsWith('en'));
  if (naturalVoice) {
    utterance.voice = naturalVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
