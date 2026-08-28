// Fit AI App Profile & AI Personalization Settings View
import { store, DEMO_PRESETS } from '../state.js';
import { sound } from '../utils/audio.js';
import { startTutorial } from './tutorial.js';

export function renderProfileView(container) {
  const profile = store.getState();
  const targets = profile.targets || { bmr: 1750, tdee: 2450, targetCalories: 2200 };

  container.innerHTML = `
    <div class="space-y-6 pb-24 max-w-3xl mx-auto animate-in fade-in duration-300">
      
      <!-- Top Profile Hero Card -->
      <div class="glass-card p-6 border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-5 relative overflow-hidden">
        <div class="relative w-20 h-20 rounded-3xl p-1 bg-gradient-to-tr from-emerald-400 to-cyan-400 flex-shrink-0 shadow-xl shadow-emerald-500/20">
          <img src="${profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}" alt="Avatar" class="w-full h-full object-cover rounded-[20px]">
          <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-bold border-2 border-slate-950">
            ✓
          </div>
        </div>

        <div class="flex-1 text-center sm:text-left">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 class="text-xl sm:text-2xl font-extrabold text-white">${profile.name}</h2>
              <p class="text-xs text-slate-400">${profile.email} • ${profile.phone || '+1 (555) 000-0000'}</p>
            </div>
            <div class="flex items-center justify-center sm:justify-end gap-2">
              <span class="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">
                🔥 ${profile.streakDays || 14} Day Streak
              </span>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium">🎯 Goal: <strong class="text-white capitalize">${profile.primaryGoal.replace('_', ' ')}</strong></span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium">🏋️ Gear: <strong class="text-white capitalize">${profile.equipmentAvailable}</strong></span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium">🥗 Diet: <strong class="text-white capitalize">${profile.dietaryStyle.replace('_', ' ')}</strong></span>
          </div>
        </div>
      </div>

      <!-- Quick Demo Presets Switcher -->
      <div class="glass-card p-5 border border-slate-800 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span>⚡ Load Instant Demo Archetypes</span>
          </h3>
          <span class="text-[10px] text-emerald-400 font-mono">1-Click Switch</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button class="preset-load-btn p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/60 text-left transition group" data-preset="muscle_builder">
            <div class="text-base mb-1">🏋️‍♂️</div>
            <div class="text-xs font-bold text-white group-hover:text-emerald-400">Marcus Vance</div>
            <div class="text-[10px] text-slate-400">Muscle Hypertrophy • Gym</div>
          </button>

          <button class="preset-load-btn p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/60 text-left transition group" data-preset="fat_loss_pro">
            <div class="text-base mb-1">🏃‍♀️</div>
            <div class="text-xs font-bold text-white group-hover:text-cyan-400">Elena Rostova</div>
            <div class="text-[10px] text-slate-400">Fat Loss Shred • Dumbbells</div>
          </button>

          <button class="preset-load-btn p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 text-left transition group" data-preset="vegan_runner">
            <div class="text-base mb-1">🌱</div>
            <div class="text-xs font-bold text-white group-hover:text-amber-400">Jordan Lee</div>
            <div class="text-[10px] text-slate-400">Endurance • Vegan Diet</div>
          </button>
        </div>
      </div>

      <!-- Metabolic Biometric Deep Dive -->
      <div class="glass-card p-5 border border-slate-800 space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">AI Metabolic Calibration</h3>
        
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Basal Metabolic Rate</span>
            <span class="text-lg font-extrabold font-mono text-white">${targets.bmr}</span>
            <span class="text-[10px] text-slate-500 block">kcal/day</span>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1">TDEE Total Output</span>
            <span class="text-lg font-extrabold font-mono text-emerald-400">${targets.tdee}</span>
            <span class="text-[10px] text-slate-500 block">kcal/day</span>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Height & Weight</span>
            <span class="text-lg font-extrabold font-mono text-white">${profile.heightCm}cm / ${profile.weightKg}kg</span>
            <span class="text-[10px] text-slate-500 block">Age: ${profile.age}</span>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Readiness Score</span>
            <span class="text-lg font-extrabold font-mono text-cyan-400">${profile.readinessScore}%</span>
            <span class="text-[10px] text-slate-500 block">Neural recovery</span>
          </div>
        </div>
      </div>

      <!-- App Preferences & Theme Controls -->
      <div class="glass-card p-5 border border-slate-800 space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Preferences & Controls</h3>

        <div class="divide-y divide-slate-800/80 text-xs">
          
          <!-- Theme Toggle -->
          <div class="py-3 flex items-center justify-between">
            <div>
              <div class="font-bold text-white">Color Theme</div>
              <div class="text-slate-400 text-[11px]">Toggle between Obsidian Dark and Clean Light</div>
            </div>
            <button id="btn-toggle-theme-profile" class="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold transition hover:border-emerald-500 flex items-center gap-1.5">
              <span>${profile.theme === 'light' ? '☀️ Light' : '🌙 Dark'}</span>
            </button>
          </div>

          <!-- Re-Take Quiz -->
          <div class="py-3 flex items-center justify-between">
            <div>
              <div class="font-bold text-white">Re-Calibrate Personalization Quiz</div>
              <div class="text-slate-400 text-[11px]">Re-run the 6-step wizard to update biometrics or goals</div>
            </div>
            <button id="btn-retake-quiz" class="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold hover:bg-emerald-500 hover:text-slate-950 transition">
              Re-run Quiz ⚙️
            </button>
          </div>

          <div class="py-3 flex items-center justify-between">
            <div>
              <div class="font-bold text-white">FitAI Smart App Tutorial</div>
              <div class="text-slate-400 text-[11px]">Take the guided tour of your dashboard, coach, workouts, and nutrition plan</div>
            </div>
            <button id="btn-start-tutorial" class="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold hover:bg-cyan-500 hover:text-slate-950 transition">
              Start Tour
            </button>
          </div>

          <!-- Sound Effects -->
          <div class="py-3 flex items-center justify-between">
            <div>
              <div class="font-bold text-white">Audio Synthesis FX</div>
              <div class="text-slate-400 text-[11px]">Workout interval beeps, countdown ticks, and chimes</div>
            </div>
            <button id="btn-toggle-sound" class="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold transition">
              ${sound.enabled ? '🔊 Sound On' : '🔇 Sound Muted'}
            </button>
          </div>

        </div>
      </div>

      <!-- Account Actions -->
      <div class="flex items-center justify-between pt-2">
        <button id="btn-logout" class="px-4 py-2 rounded-xl bg-slate-900 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition">
          Sign Out of Account
        </button>

        <button id="btn-reset-all" class="text-xs text-slate-500 hover:text-slate-300 underline transition">
          Reset All Data to Factory Default
        </button>
      </div>

    </div>
  `;

  // Attach Listeners
  // Theme toggle
  container.querySelector('#btn-toggle-theme-profile')?.addEventListener('click', () => {
    sound.playTap();
    store.toggleTheme();
    renderProfileView(container);
  });

  // Retake quiz
  container.querySelector('#btn-retake-quiz')?.addEventListener('click', () => {
    sound.playTap();
    store.setAuthMode('quiz');
  });

  container.querySelector('#btn-start-tutorial')?.addEventListener('click', () => {
    sound.playTap();
    startTutorial();
  });

  // Sound toggle
  container.querySelector('#btn-toggle-sound')?.addEventListener('click', () => {
    sound.enabled = !sound.enabled;
    sound.playTap();
    renderProfileView(container);
  });

  // Demo Archetype Presets
  container.querySelectorAll('.preset-load-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playGo();
      const presetKey = btn.getAttribute('data-preset');
      store.loadPreset(presetKey);
      renderProfileView(container);
    });
  });

  // Logout
  container.querySelector('#btn-logout')?.addEventListener('click', () => {
    sound.playTap();
    store.logout();
  });

  // Reset all
  container.querySelector('#btn-reset-all')?.addEventListener('click', () => {
    if (confirm('Reset all user data and return to welcome flow?')) {
      localStorage.clear();
      location.reload();
    }
  });
}
