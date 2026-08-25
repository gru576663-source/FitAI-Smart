// FitAI Smart Daily Advisor (Home Dashboard)
import { store } from '../state.js';
import { getTimeGreeting } from '../utils/helpers.js';
import { AI_ENGINE } from '../aiEngine.js';
import { sound } from '../utils/audio.js';

export function renderHomeView(container) {
  const profile = store.getState();
  const targets = profile.targets || { targetCalories: 2200, targetProtein: 160, waterTarget: 2800 };
  const greetingData = getTimeGreeting(profile.name.split(' ')[0] || 'Athlete');
  const completedIds = profile.completedScheduleIds || [];

  // Generate today's schedule items based on profile
  const scheduleData = [
    {
      id: 'item_water_am',
      time: '07:30 AM',
      icon: '💧',
      title: 'Morning Cellular Hydration',
      tag: 'HYDRATION',
      tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      description: '500ml pure water + pinch of pink Himalayan sea salt to restore cellular electrolyte balance upon waking.'
    },
    {
      id: 'item_pre_snack',
      time: profile.peakEnergyWindow === 'morning' ? '08:00 AM' : '04:30 PM',
      icon: '⚡',
      title: 'Pre-Workout Glycogen Primer',
      tag: 'NUTRITION',
      tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      description: '35g rapid carbs + 15g light protein. Boosts ATP without gastric heaviness.'
    },
    {
      id: 'item_workout_session',
      time: profile.peakEnergyWindow === 'morning' ? '08:45 AM' : '05:15 PM',
      icon: '🏋️',
      title: 'AI Scheduled Workout Session',
      tag: 'TRAINING',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: `Target: ${profile.primaryGoal.toUpperCase()} (${profile.equipmentAvailable.toUpperCase()}) • 30 mins focused stimulus.`
    },
    {
      id: 'item_post_meal',
      time: profile.peakEnergyWindow === 'morning' ? '10:00 AM' : '06:30 PM',
      icon: '🍗',
      title: 'Anabolic Recovery Window',
      tag: 'NUTRITION',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: `Target ${Math.round(targets.targetProtein * 0.3)}g high-leucine protein to accelerate muscle repair.`
    },
    {
      id: 'item_evening_hydration',
      time: '08:30 PM',
      icon: '🌙',
      title: 'Evening Decompression & Magnesium',
      tag: 'RECOVERY',
      tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      description: 'Herbal infusion, screen dimming, and magnesium glycinate for deep Stage 3 regenerative sleep.'
    }
  ];

  const totalScheduleItems = scheduleData.length;
  const completedCount = scheduleData.filter(item => completedIds.includes(item.id)).length;
  const scheduleProgressPercent = Math.round((completedCount / totalScheduleItems) * 100);

  container.innerHTML = `
    <div class="space-y-6 pb-24 animate-in fade-in duration-300">
      
      <!-- Top Greeting & Dynamic Bio-Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>AI Bio-Advisor Active</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>${greetingData.greeting}</span>
            <span>${greetingData.emoji}</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-0.5">${greetingData.quote}</p>
        </div>

        <!-- Streak Badge -->
        <div class="flex items-center gap-3">
          <div class="glass-card px-4 py-2.5 flex items-center gap-2.5 border border-amber-500/30 bg-amber-500/5">
            <div class="text-2xl animate-bounce">🔥</div>
            <div>
              <div class="text-base font-extrabold text-amber-400 font-mono leading-none">${profile.streakDays || 14} DAYS</div>
              <div class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Adherence Streak</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Readiness & Quick Fatigue Check-In Banner -->
      <div class="glass-card p-5 border border-slate-800 relative overflow-hidden">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div class="flex items-center gap-4">
            <!-- Readiness Circle Indicator -->
            <div class="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <svg class="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="currentColor" stroke-width="4" class="text-slate-800" fill="none" />
                <circle cx="32" cy="32" r="26" stroke="currentColor" stroke-width="4" stroke-dasharray="163.36" stroke-dashoffset="${163.36 - (163.36 * (profile.readinessScore || 92)) / 100}" class="text-emerald-400 transition-all duration-700" stroke-linecap="round" fill="none" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-sm font-extrabold text-white font-mono leading-none">${profile.readinessScore || 92}%</span>
                <span class="text-[9px] text-slate-400 uppercase tracking-tighter">PRIME</span>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <span>Daily Readiness & Recovery</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold uppercase">Calibrated</span>
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                Metabolism primed. AI recommends a moderate-to-high intensity session today.
              </p>
            </div>
          </div>

          <!-- Fatigue Check-In Selector -->
          <div class="w-full md:w-auto flex flex-col gap-1.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
            <span class="text-[11px] font-semibold text-slate-400">How's your body feeling right now?</span>
            <div class="flex items-center gap-1.5" id="fatigue-selector">
              <button data-fatigue="fresh" class="fatigue-btn flex-1 md:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${profile.fatigueLevel === 'fresh' ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}">
                ⚡ Fresh
              </button>
              <button data-fatigue="low" class="fatigue-btn flex-1 md:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${profile.fatigueLevel === 'low' ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}">
                👍 Good
              </button>
              <button data-fatigue="moderate" class="fatigue-btn flex-1 md:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${profile.fatigueLevel === 'moderate' ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}">
                ⚠️ Mild Sore
              </button>
              <button data-fatigue="high" class="fatigue-btn flex-1 md:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${profile.fatigueLevel === 'high' ? 'bg-rose-500 text-white border-rose-400 shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}">
                🛡️ High Fatigue
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Quick AI Action Prompts -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span>⚡ Instant AI Prompts</span>
          </h3>
          <span class="text-[11px] text-emerald-400 font-medium">1-Tap Advisor</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button class="quick-ai-btn p-3 rounded-xl glass-card border border-slate-800/80 hover:border-emerald-500/50 text-left transition active:scale-[0.97] group" data-prompt="What should I workout today?">
            <div class="text-xl mb-1 group-hover:scale-110 transition-transform">🏋️</div>
            <div class="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Daily Workout</div>
            <div class="text-[10px] text-slate-400 line-clamp-1">Tailored for today</div>
          </button>

          <button class="quick-ai-btn p-3 rounded-xl glass-card border border-slate-800/80 hover:border-cyan-500/50 text-left transition active:scale-[0.97] group" data-prompt="I'm feeling sore today, adapt my plan">
            <div class="text-xl mb-1 group-hover:scale-110 transition-transform">🧘</div>
            <div class="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">Soreness / Recovery</div>
            <div class="text-[10px] text-slate-400 line-clamp-1">Decompress tight joints</div>
          </button>

          <button class="quick-ai-btn p-3 rounded-xl glass-card border border-slate-800/80 hover:border-amber-500/50 text-left transition active:scale-[0.97] group" data-prompt="What should I eat right now for maximum recovery?">
            <div class="text-xl mb-1 group-hover:scale-110 transition-transform">🥑</div>
            <div class="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">Meal Timing</div>
            <div class="text-[10px] text-slate-400 line-clamp-1">Fast glycogen refueling</div>
          </button>

          <button class="quick-ai-btn p-3 rounded-xl glass-card border border-slate-800/80 hover:border-purple-500/50 text-left transition active:scale-[0.97] group" data-prompt="Give me key form tips for squats">
            <div class="text-xl mb-1 group-hover:scale-110 transition-transform">🎯</div>
            <div class="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">Form Check</div>
            <div class="text-[10px] text-slate-400 line-clamp-1">Safe biomechanics</div>
          </button>
        </div>
      </div>

      <!-- Current Day's Recommended Schedule -->
      <div class="glass-card p-5 sm:p-6 border border-slate-800">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <span>Today's Recommended AI Schedule</span>
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">Automated chronological plan matching your biometrics & energy windows</p>
          </div>
          <div class="text-right">
            <span class="text-xs font-mono font-bold text-emerald-400">${completedCount}/${totalScheduleItems}</span>
            <div class="w-16 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
              <div class="h-full bg-emerald-400" style="width: ${scheduleProgressPercent}%;"></div>
            </div>
          </div>
        </div>

        <!-- Timeline Items -->
        <div class="space-y-3" id="schedule-timeline-container">
          ${scheduleData.map((item, index) => {
            const isDone = completedIds.includes(item.id);
            return `
              <div class="schedule-item-card p-4 rounded-xl border transition-all flex items-start gap-3.5 ${isDone ? 'bg-slate-900/40 border-slate-800/50 opacity-70' : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'}" data-id="${item.id}">
                <button class="toggle-schedule-btn mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition active:scale-90 ${isDone ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold' : 'border-slate-700 hover:border-emerald-500 bg-slate-950 text-transparent'}" data-id="${item.id}">
                  ✓
                </button>
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                    <div class="flex items-center gap-2">
                      <span class="text-base">${item.icon}</span>
                      <h4 class="text-xs sm:text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}">${item.title}</h4>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">${item.time}</span>
                      <span class="text-[9px] font-bold px-2 py-0.5 rounded border ${item.tagColor}">${item.tag}</span>
                    </div>
                  </div>
                  <p class="text-xs text-slate-400 leading-relaxed">${item.description}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Quick Workout Start Action -->
        <div class="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="text-xs text-slate-400">
            Ready to train? Let the AI coach guide your rest intervals & tempo.
          </div>
          <button id="btn-home-start-workout" class="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition active:scale-95 flex items-center justify-center gap-2">
            <span>⚡ Start AI Guided Workout</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>

    </div>
  `;

  // Attach Event Listeners
  // 1. Fatigue Selector
  container.querySelectorAll('.fatigue-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playTap();
      const level = btn.getAttribute('data-fatigue');
      let newReadiness = 92;
      if (level === 'fresh') newReadiness = 97;
      if (level === 'low') newReadiness = 90;
      if (level === 'moderate') newReadiness = 78;
      if (level === 'high') newReadiness = 60;

      store.updateProfile({
        fatigueLevel: level,
        readinessScore: newReadiness
      });
      renderHomeView(container);
    });
  });

  // 2. Quick AI prompt buttons -> switch to coach tab and send query
  container.querySelectorAll('.quick-ai-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playTap();
      const prompt = btn.getAttribute('data-prompt');
      store.setTab('coach');
      // trigger after tab renders
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('FitAI Smart:sendCoachQuery', { detail: { query: prompt } }));
      }, 100);
    });
  });

  // 3. Schedule item toggles
  container.querySelectorAll('.toggle-schedule-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playTap();
      const id = btn.getAttribute('data-id');
      store.toggleScheduleItem(id);
      renderHomeView(container);
    });
  });

  // 4. Start Workout Button -> switch to workouts tab
  container.querySelector('#btn-home-start-workout')?.addEventListener('click', () => {
    sound.playTap();
    store.setTab('workouts');
  });
}
