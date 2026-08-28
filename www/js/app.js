// Fit AI App Main Application Controller & Router
import { store } from './state.js';
import { renderAuthView } from './auth.js';
import { renderQuizView } from './quiz.js';
import { renderHomeView } from './components/homeView.js';
import { renderWorkoutsView } from './components/workoutsView.js';
import { renderCoachView } from './components/coachView.js';
import { renderNutritionView } from './components/nutritionView.js';
import { renderProfileView } from './components/profileView.js';
import { renderTutorial } from './components/tutorial.js';
import { sound } from './utils/audio.js';

function initApp() {
  const root = document.getElementById('app-root');
  if (!root) return;

  // Apply initial theme
  const initialState = store.getState();
  document.documentElement.setAttribute('data-theme', initialState.theme || 'dark');

  // Main render loop based on state
  // Flow Order: 1. Login & Signup -> 2. Personalization Quiz -> 3. Home Dashboard
  function render() {
    const state = store.getState();
    const authMode = store.getAuthMode();
    const currentTab = store.getTab();

    // 1. If not logged in, render Login & Signup Page
    if (!state.isLoggedIn) {
      renderAuthView(root);
      return;
    }

    // 2. If logged in but quiz not completed, render Personalization Quiz
    if (authMode === 'quiz' || (!state.hasCompletedQuiz && authMode !== 'app')) {
      renderQuizView(root);
      return;
    }

    // 3. Render Full Main App Shell (Home Page / Advisor Dashboard)
    root.innerHTML = `
      <div class="min-h-screen flex flex-col justify-between max-w-5xl mx-auto px-3 sm:px-6 relative">
        
        <!-- Top App Navigation Header -->
        <header class="py-4 border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-emerald-500/20">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <span class="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Fit AI App
              </span>
              <span class="hidden sm:inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">AI ADVISOR</span>
            </div>
          </div>

          <!-- Top Right Controls -->
          <div class="flex items-center gap-2">
            <!-- Theme Toggle -->
            <button id="btn-top-theme-toggle" class="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition" title="Toggle Dark/Light Mode">
              ${state.theme === 'light' ? '☀️' : '🌙'}
            </button>

            <!-- Streak Pill -->
            <div class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-mono font-bold">
              <span>🔥</span> <span>${state.streakDays || 14}d</span>
            </div>

            <!-- Profile Avatar Shortcut -->
            <button id="btn-top-profile" class="w-9 h-9 rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-400 transition ml-1" title="My Profile">
              <img src="${state.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}" alt="Profile" class="w-full h-full object-cover">
            </button>
          </div>
        </header>

        <!-- Main Viewport Router Container (Default: 3. Home Page) -->
        <main id="tab-viewport" class="flex-1 py-4 sm:py-6">
          <!-- Dynamically populated by sub-components -->
        </main>

        <!-- Bottom Tab Navigation Bar -->
        <nav class="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-xl py-2 px-3">
          <div class="max-w-md mx-auto flex items-center justify-around">
            
            <!-- Tab 1: Daily Advisor (Home) -->
            <button class="nav-tab-btn flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition ${currentTab === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'}" data-tab="home">
              <span class="text-xl ${currentTab === 'home' ? 'scale-110' : ''} transition-transform">🧭</span>
              <span class="text-[10px] tracking-tight">Advisor</span>
            </button>

            <!-- Tab 2: Workouts -->
            <button class="nav-tab-btn flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition ${currentTab === 'workouts' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'}" data-tab="workouts">
              <span class="text-xl ${currentTab === 'workouts' ? 'scale-110' : ''} transition-transform">🏋️</span>
              <span class="text-[10px] tracking-tight">Workouts</span>
            </button>

            <!-- Tab 3: AI Coach (Center Highlight) -->
            <button class="nav-tab-btn flex flex-col items-center gap-1 px-3.5 py-1.5 rounded-2xl transition relative group ${currentTab === 'coach' ? 'text-cyan-400 font-bold' : 'text-slate-300 hover:text-white font-medium'}" data-tab="coach">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 flex items-center justify-center text-sm shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform ${currentTab === 'coach' ? 'ring-2 ring-cyan-400' : ''}">
                🤖
              </div>
              <span class="text-[10px] tracking-tight">AI Coach</span>
            </button>

            <!-- Tab 4: Nutrition -->
            <button class="nav-tab-btn flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition ${currentTab === 'nutrition' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'}" data-tab="nutrition">
              <span class="text-xl ${currentTab === 'nutrition' ? 'scale-110' : ''} transition-transform">🥗</span>
              <span class="text-[10px] tracking-tight">Nutrition</span>
            </button>

            <!-- Tab 5: Profile -->
            <button class="nav-tab-btn flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition ${currentTab === 'profile' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'}" data-tab="profile">
              <span class="text-xl ${currentTab === 'profile' ? 'scale-110' : ''} transition-transform">👤</span>
              <span class="text-[10px] tracking-tight">Profile</span>
            </button>

          </div>
        </nav>

      </div>
    `;

    // Render active tab view (Default is 3. Home Page)
    const viewport = root.querySelector('#tab-viewport');
    if (viewport) {
      if (currentTab === 'home') renderHomeView(viewport);
      else if (currentTab === 'workouts') renderWorkoutsView(viewport);
      else if (currentTab === 'coach') renderCoachView(viewport);
      else if (currentTab === 'nutrition') renderNutritionView(viewport);
      else if (currentTab === 'profile') renderProfileView(viewport);
    }

    // Attach Top Header and Navigation Tab Listeners
    root.querySelector('#btn-top-theme-toggle')?.addEventListener('click', () => {
      sound.playTap();
      store.toggleTheme();
    });

    root.querySelector('#btn-top-profile')?.addEventListener('click', () => {
      sound.playTap();
      store.setTab('profile');
    });

    root.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playTap();
        const tab = btn.getAttribute('data-tab');
        store.setTab(tab);
      });
    });

    renderTutorial(root);
  }

  // Subscribe to store updates
  store.subscribe(render);

  // Initial render
  render();
}

// Start on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
