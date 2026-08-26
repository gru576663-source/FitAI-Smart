// Fit AI App Global Reactive State Management
import { calculateMetabolicTargets } from './utils/helpers.js';

const STORAGE_KEY = 'fit_ai_app_state_v2';

// Default User Profile
export const DEFAULT_USER = {
  id: 'usr_demo_01',
  name: 'Alex Rivera',
  email: 'alex.rivera@fitai.app',
  phone: '+1 (555) 382-9901',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isLoggedIn: false, // Default to false so user starts on 1. Login & Signup Page
  hasCompletedQuiz: false, // Default to false so user progresses to 2. Quiz, then 3. Home
  theme: 'dark', // 'dark' or 'light'
  
  // Biometrics
  age: 27,
  gender: 'male',
  heightCm: 178,
  weightKg: 74,
  heightUnit: 'cm', // 'cm' or 'ft'
  weightUnit: 'kg', // 'kg' or 'lbs'
  
  // Goals & Activity
  primaryGoal: 'muscle', // 'weight_loss' | 'muscle' | 'endurance' | 'tone'
  activityLevel: 'moderate', // 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete'
  equipmentAvailable: 'dumbbells', // 'gym' | 'dumbbells' | 'bands' | 'bodyweight'
  
  // Nutrition & Schedule
  dietaryStyle: 'high_protein', // 'balanced' | 'high_protein' | 'vegan' | 'vegetarian' | 'keto' | 'mediterranean'
  allergies: ['gluten_free'], // array of strings
  peakEnergyWindow: 'morning', // 'morning' | 'midday' | 'evening' | 'night'
  
  // Daily Dynamic Status
  streakDays: 14,
  readinessScore: 92, // 0 - 100
  fatigueLevel: 'low', // 'fresh' | 'low' | 'moderate' | 'high'
  soundEnabled: true,
  showTutorial: false,
  hasSeenTutorial: false,
  
  // Hydration state for today
  waterIntakeCurrent: 1750, // mL consumed
  
  // Today's schedule completion tracking
  completedScheduleIds: ['item_water_am', 'item_pre_snack'],
  
  // AI Coach conversation history
  chatMessages: [
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: "👋 Hey there! I'm your Fit AI Coach. I've tailored today's routine for upper body strength and calibrated your pre-workout carbs. How is your energy feeling right now?",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      quickSuggestions: [
        "Feeling great, ready to train!",
        "A bit sore in my shoulders",
        "Suggest a 20-min routine",
        "What should I eat for dinner?"
      ]
    }
  ]
};

// Preset Profiles for instant switching/testing
export const DEMO_PRESETS = {
  muscle_builder: {
    name: 'Marcus Vance',
    email: 'marcus@fitai.app',
    age: 26,
    gender: 'male',
    heightCm: 182,
    weightKg: 82,
    primaryGoal: 'muscle',
    activityLevel: 'active',
    equipmentAvailable: 'gym',
    dietaryStyle: 'high_protein',
    allergies: [],
    peakEnergyWindow: 'evening',
    streakDays: 21,
    readinessScore: 96,
    fatigueLevel: 'fresh'
  },
  fat_loss_pro: {
    name: 'Elena Rostova',
    email: 'elena@fitai.app',
    age: 31,
    gender: 'female',
    heightCm: 165,
    weightKg: 64,
    primaryGoal: 'weight_loss',
    activityLevel: 'moderate',
    equipmentAvailable: 'dumbbells',
    dietaryStyle: 'mediterranean',
    allergies: ['dairy_free'],
    peakEnergyWindow: 'morning',
    streakDays: 9,
    readinessScore: 88,
    fatigueLevel: 'low'
  },
  vegan_runner: {
    name: 'Jordan Lee',
    email: 'jordan@fitai.app',
    age: 29,
    gender: 'other',
    heightCm: 173,
    weightKg: 68,
    primaryGoal: 'endurance',
    activityLevel: 'athlete',
    equipmentAvailable: 'bodyweight',
    dietaryStyle: 'vegan',
    allergies: ['nut_free'],
    peakEnergyWindow: 'morning',
    streakDays: 34,
    readinessScore: 94,
    fatigueLevel: 'moderate'
  }
};

class StateManager {
  constructor() {
    this.subscribers = new Set();
    this.currentTab = 'home'; // 'home' | 'workouts' | 'coach' | 'nutrition' | 'profile'
    this.authMode = 'login'; // 'login' | 'signup' | 'forgot' | 'quiz' | 'app'
    this.state = this.loadInitialState();
  }

  loadInitialState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_USER,
          ...parsed,
          targets: calculateMetabolicTargets(parsed)
        };
      }
    } catch (e) {
      console.warn('Could not read localStorage:', e);
    }
    return {
      ...DEFAULT_USER,
      targets: calculateMetabolicTargets(DEFAULT_USER)
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Could not save to localStorage:', e);
    }
  }

  getState() {
    return this.state;
  }

  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  notify() {
    this.saveState();
    this.subscribers.forEach(fn => {
      try {
        fn(this.state);
      } catch (err) {
        console.error('Subscriber error:', err);
      }
    });
  }

  updateProfile(partial) {
    this.state = {
      ...this.state,
      ...partial
    };
    this.state.targets = calculateMetabolicTargets(this.state);
    this.notify();
  }

  setTab(tab) {
    this.currentTab = tab;
    this.notify();
  }

  getTab() {
    return this.currentTab;
  }

  setAuthMode(mode) {
    this.authMode = mode;
    this.notify();
  }

  getAuthMode() {
    return this.authMode;
  }

  toggleTheme() {
    const nextTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.updateProfile({ theme: nextTheme });
    document.documentElement.setAttribute('data-theme', nextTheme);
  }

  addChatMessage(msg) {
    const chatMessages = [...this.state.chatMessages, {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      ...msg
    }];
    this.updateProfile({ chatMessages });
  }

  clearChat() {
    this.updateProfile({
      chatMessages: [
        {
          id: 'msg_welcome_' + Date.now(),
          sender: 'ai',
          text: `Chat refreshed! How can I assist you with your workout or nutrition plan right now, ${this.state.name}?`,
          timestamp: new Date().toISOString(),
          quickSuggestions: [
            "Suggest today's workout routine",
            "What should I eat post-workout?",
            "Quick lower back stretch",
            "How to optimize protein absorption?"
          ]
        }
      ]
    });
  }

  toggleScheduleItem(id) {
    let completed = [...(this.state.completedScheduleIds || [])];
    if (completed.includes(id)) {
      completed = completed.filter(item => item !== id);
    } else {
      completed.push(id);
    }
    this.updateProfile({ completedScheduleIds: completed });
  }

  addWater(ml = 250) {
    const current = Math.min(this.state.waterIntakeCurrent + ml, (this.state.targets?.waterTarget || 3000) * 1.5);
    this.updateProfile({ waterIntakeCurrent: current });
  }

  resetWater() {
    this.updateProfile({ waterIntakeCurrent: 0 });
  }

  loadPreset(presetKey) {
    const preset = DEMO_PRESETS[presetKey];
    if (preset) {
      this.updateProfile({
        ...preset,
        isLoggedIn: true,
        hasCompletedQuiz: true,
        completedScheduleIds: [],
        waterIntakeCurrent: 500
      });
      this.setAuthMode('app');
      this.setTab('home');
    }
  }

  logout() {
    this.updateProfile({
      isLoggedIn: false,
      hasCompletedQuiz: false
    });
    this.setAuthMode('login');
  }

  loginAsGuest() {
    // Directs guest user through 1. Login -> 2. Quiz -> 3. Home
    this.updateProfile({
      isLoggedIn: true,
      hasCompletedQuiz: false
    });
    this.setAuthMode('quiz');
  }
}

export const store = new StateManager();
