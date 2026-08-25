// FitAI Smart Workouts Tab & Interactive AI Workout Runner
import { store } from '../state.js';
import { AI_ENGINE } from '../aiEngine.js';
import { sound } from '../utils/audio.js';
import { formatSeconds } from '../utils/helpers.js';

let activeWorkoutPlan = null;
let currentWorkoutRunnerState = {
  isOpen: false,
  exerciseIndex: 0,
  setIndex: 1,
  isResting: false,
  timerSecondsRemaining: 45,
  timerIntervalId: null,
  isPaused: false
};

export function renderWorkoutsView(container) {
  const profile = store.getState();

  // Generate initial workout if not already set
  if (!activeWorkoutPlan) {
    activeWorkoutPlan = AI_ENGINE.generateWorkout({
      focus: 'full_body',
      duration: 30,
      equipment: profile.equipmentAvailable,
      fatigue: profile.fatigueLevel
    }, profile);
  }

  container.innerHTML = `
    <div class="space-y-6 pb-24 animate-in fade-in duration-300">
      
      <!-- Top Title & Description -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <span>Adaptive Programming</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white">AI Workout Generator</h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-0.5">On-demand tailored routines based on your fatigue & available gear</p>
        </div>

        <button id="btn-start-runner" class="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <span>Start Active Workout</span>
        </button>
      </div>

      <!-- Generator Configuration Controls -->
      <div class="glass-card p-5 border border-slate-800 space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <span>⚙️ Routine Synthesis Parameters</span>
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <!-- Focus Selector -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Target Focus</label>
            <select id="gen-focus" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-emerald-500">
              <option value="full_body" ${activeWorkoutPlan.focus === 'full_body' ? 'selected' : ''}>Full Body Primer</option>
              <option value="upper" ${activeWorkoutPlan.focus === 'upper' ? 'selected' : ''}>Upper Body Sculpt</option>
              <option value="lower" ${activeWorkoutPlan.focus === 'lower' ? 'selected' : ''}>Lower Body Power</option>
              <option value="core_hiit" ${activeWorkoutPlan.focus === 'core_hiit' ? 'selected' : ''}>Core & HIIT Conditioning</option>
              <option value="mobility" ${activeWorkoutPlan.focus === 'mobility' ? 'selected' : ''}>Regenerative Joint Flow</option>
            </select>
          </div>

          <!-- Duration Selector -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Available Time</label>
            <select id="gen-duration" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-emerald-500">
              <option value="15" ${activeWorkoutPlan.durationMinutes === 15 ? 'selected' : ''}>15 mins (Express)</option>
              <option value="20" ${activeWorkoutPlan.durationMinutes === 20 ? 'selected' : ''}>20 mins (High-Tempo)</option>
              <option value="30" ${activeWorkoutPlan.durationMinutes === 30 ? 'selected' : ''}>30 mins (Optimal)</option>
              <option value="45" ${activeWorkoutPlan.durationMinutes === 45 ? 'selected' : ''}>45 mins (Volume)</option>
            </select>
          </div>

          <!-- Equipment Override -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Equipment</label>
            <select id="gen-equipment" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-emerald-500">
              <option value="gym" ${activeWorkoutPlan.equipment === 'gym' ? 'selected' : ''}>Full Commercial Gym</option>
              <option value="dumbbells" ${activeWorkoutPlan.equipment === 'dumbbells' ? 'selected' : ''}>Dumbbells & Bench</option>
              <option value="bands" ${activeWorkoutPlan.equipment === 'bands' ? 'selected' : ''}>Resistance Bands</option>
              <option value="bodyweight" ${activeWorkoutPlan.equipment === 'bodyweight' ? 'selected' : ''}>Bodyweight Only</option>
            </select>
          </div>

        </div>

        <button id="btn-re-generate" class="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition flex items-center justify-center gap-2">
          <span>⚡ Synthesize Custom Routine</span>
        </button>
      </div>

      <!-- Active Routine Overview Card -->
      <div class="glass-card p-6 border border-slate-800 space-y-6">
        
        <!-- Header & Stats -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase">${activeWorkoutPlan.focus.replace('_', ' ')}</span>
              <span class="text-xs text-slate-400 font-mono">~${activeWorkoutPlan.estimatedCaloriesBurned} kcal</span>
            </div>
            <h2 class="text-xl font-extrabold text-white mt-1">${activeWorkoutPlan.title}</h2>
          </div>

          <div class="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">⏱️ ${activeWorkoutPlan.durationMinutes} MINS</span>
            <span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">🏋️ ${activeWorkoutPlan.exercises.length} MOVEMENTS</span>
          </div>
        </div>

        <!-- AI Coach Adaptive Note -->
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-3">
          <span class="text-lg">🤖</span>
          <div>
            <span class="font-bold">AI Coach Context:</span> ${activeWorkoutPlan.aiCoachNote}
          </div>
        </div>

        <!-- Warm-Up Protocol -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">1. Dynamic Activation (3 Mins)</h4>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            ${activeWorkoutPlan.warmup.map(item => `
              <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <span class="text-emerald-400 font-bold">✓</span>
                <span>${item}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Main Exercises List -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">2. Primary Working Sets</h4>
          
          <div class="space-y-3">
            ${activeWorkoutPlan.exercises.map((ex, idx) => `
              <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition space-y-2">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div class="flex items-center gap-3">
                    <span class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold font-mono text-xs">
                      0${idx + 1}
                    </span>
                    <div>
                      <h4 class="text-sm font-bold text-white">${ex.name}</h4>
                      <span class="text-[11px] text-slate-400">${ex.target}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 text-xs font-mono">
                    <span class="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-emerald-400 font-bold">${ex.sets} SETS × ${ex.reps}</span>
                    <span class="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400">${ex.rest}s REST</span>
                  </div>
                </div>

                <div class="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 flex items-start gap-2">
                  <span class="text-amber-400 text-xs">💡</span>
                  <span><strong class="text-slate-300">Biomechanical Cue:</strong> ${ex.cue}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Cool-Down Protocol -->
        <div class="space-y-2 pt-2 border-t border-slate-800">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">3. Cool-Down & Parasympathetic Reset</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${activeWorkoutPlan.cooldown.map(item => `
              <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <span class="text-purple-400 font-bold">✦</span>
                <span>${item}</span>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

    </div>

    <!-- Active Workout Runner Modal (Fullscreen Interactive Overlay) -->
    <div id="workout-runner-modal" class="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl hidden flex flex-col p-4 sm:p-6 overflow-y-auto">
      <div class="max-w-xl w-full mx-auto flex-1 flex flex-col justify-between py-2" id="runner-content">
        <!-- Injected via updateRunnerUI -->
      </div>
    </div>
  `;

  // Event handlers
  const btnReGen = container.querySelector('#btn-re-generate');
  const btnStartRunner = container.querySelector('#btn-start-runner');
  const runnerModal = container.querySelector('#workout-runner-modal');

  btnReGen?.addEventListener('click', () => {
    sound.playTap();
    const focus = container.querySelector('#gen-focus').value;
    const duration = container.querySelector('#gen-duration').value;
    const equipment = container.querySelector('#gen-equipment').value;

    activeWorkoutPlan = AI_ENGINE.generateWorkout({
      focus,
      duration,
      equipment,
      fatigue: profile.fatigueLevel
    }, profile);

    renderWorkoutsView(container);
  });

  btnStartRunner?.addEventListener('click', () => {
    sound.playGo();
    currentWorkoutRunnerState = {
      isOpen: true,
      exerciseIndex: 0,
      setIndex: 1,
      isResting: false,
      timerSecondsRemaining: 45,
      timerIntervalId: null,
      isPaused: false
    };
    runnerModal?.classList.remove('hidden');
    renderWorkoutRunner(container);
  });
}

function renderWorkoutRunner(container) {
  const runnerContent = container.querySelector('#runner-content');
  const runnerModal = container.querySelector('#workout-runner-modal');
  if (!runnerContent || !activeWorkoutPlan) return;

  const currentEx = activeWorkoutPlan.exercises[currentWorkoutRunnerState.exerciseIndex];
  const totalExercises = activeWorkoutPlan.exercises.length;

  if (!currentEx) {
    // Workout Complete Screen
    sound.playComplete();
    runnerContent.innerHTML = `
      <div class="text-center my-auto space-y-5 animate-in zoom-in-95 duration-300">
        <div class="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center text-4xl mx-auto animate-bounce">
          🏆
        </div>
        <h2 class="text-3xl font-extrabold text-white">Workout Complete!</h2>
        <p class="text-sm text-slate-300 max-w-sm mx-auto">
          Incredible work! You completed all ${totalExercises} AI-guided movements. Time to hit your post-workout protein window!
        </p>

        <div class="glass-card p-4 max-w-xs mx-auto border border-slate-800 space-y-2 text-xs">
          <div class="flex justify-between text-slate-400">
            <span>Duration:</span>
            <span class="text-white font-bold font-mono">${activeWorkoutPlan.durationMinutes} mins</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>Est. Burn:</span>
            <span class="text-emerald-400 font-bold font-mono">~${activeWorkoutPlan.estimatedCaloriesBurned} kcal</span>
          </div>
        </div>

        <button id="btn-finish-runner" class="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/30 transition">
          Done & Return to Advisor
        </button>
      </div>
    `;

    runnerContent.querySelector('#btn-finish-runner')?.addEventListener('click', () => {
      if (currentWorkoutRunnerState.timerIntervalId) clearInterval(currentWorkoutRunnerState.timerIntervalId);
      runnerModal?.classList.add('hidden');
      store.toggleScheduleItem('item_workout_session');
      store.setTab('home');
    });
    return;
  }

  runnerContent.innerHTML = `
    <!-- Top Header -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-800">
      <div>
        <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">Exercise ${currentWorkoutRunnerState.exerciseIndex + 1} of ${totalExercises}</span>
        <h3 class="text-lg sm:text-xl font-extrabold text-white">${currentEx.name}</h3>
      </div>
      <button id="btn-close-runner" class="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 text-xs">
        ✕ Exit
      </button>
    </div>

    <!-- Active State Card -->
    <div class="glass-card p-6 border border-slate-800 my-4 text-center relative overflow-hidden">
      ${currentWorkoutRunnerState.isResting ? `
        <!-- Rest Timer State -->
        <div class="space-y-4">
          <span class="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold uppercase tracking-wider">
            💤 Rest & Recharge
          </span>
          <div class="text-6xl sm:text-7xl font-extrabold font-mono text-cyan-400">
            ${formatSeconds(currentWorkoutRunnerState.timerSecondsRemaining)}
          </div>
          <p class="text-xs text-slate-400 max-w-xs mx-auto">
            Deep diaphragmatic breaths. Next up: <strong>Set ${currentWorkoutRunnerState.setIndex} of ${currentEx.sets}</strong>
          </p>
          <button id="btn-skip-rest" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700">
            Skip Rest ⏭️
          </button>
        </div>
      ` : `
        <!-- Working Set State -->
        <div class="space-y-4">
          <span class="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            🔥 Working Set ${currentWorkoutRunnerState.setIndex} of ${currentEx.sets}
          </span>
          <div class="text-5xl sm:text-6xl font-extrabold text-white font-mono">
            ${currentEx.reps} <span class="text-2xl text-slate-400 font-sans">REPS</span>
          </div>
          <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 text-left flex items-start gap-2">
            <span class="text-emerald-400 font-bold">🎯</span>
            <div><strong class="text-white">AI Form Cue:</strong> ${currentEx.cue}</div>
          </div>
        </div>
      `}
    </div>

    <!-- Bottom Controls -->
    <div class="space-y-3 pt-2">
      ${!currentWorkoutRunnerState.isResting ? `
        <button id="btn-complete-set" class="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base shadow-lg shadow-emerald-500/25 transition active:scale-[0.98]">
          ✓ Complete Set & Start Rest
        </button>
      ` : ''}

      <div class="flex items-center justify-between text-xs text-slate-400">
        <span>Target: ${currentEx.target}</span>
        <button id="btn-next-exercise" class="text-slate-300 hover:text-emerald-400 underline font-medium">
          Skip to Next Movement →
        </button>
      </div>
    </div>
  `;

  // Attach runner listeners
  container.querySelector('#btn-close-runner')?.addEventListener('click', () => {
    if (currentWorkoutRunnerState.timerIntervalId) clearInterval(currentWorkoutRunnerState.timerIntervalId);
    runnerModal?.classList.add('hidden');
  });

  container.querySelector('#btn-skip-rest')?.addEventListener('click', () => {
    sound.playGo();
    if (currentWorkoutRunnerState.timerIntervalId) clearInterval(currentWorkoutRunnerState.timerIntervalId);
    currentWorkoutRunnerState.isResting = false;
    renderWorkoutRunner(container);
  });

  container.querySelector('#btn-complete-set')?.addEventListener('click', () => {
    sound.playTick();
    if (currentWorkoutRunnerState.setIndex < currentEx.sets) {
      currentWorkoutRunnerState.setIndex++;
      currentWorkoutRunnerState.isResting = true;
      currentWorkoutRunnerState.timerSecondsRemaining = currentEx.rest || 60;
      
      // Start Countdown Interval
      if (currentWorkoutRunnerState.timerIntervalId) clearInterval(currentWorkoutRunnerState.timerIntervalId);
      currentWorkoutRunnerState.timerIntervalId = setInterval(() => {
        currentWorkoutRunnerState.timerSecondsRemaining--;
        if (currentWorkoutRunnerState.timerSecondsRemaining <= 3 && currentWorkoutRunnerState.timerSecondsRemaining > 0) {
          sound.playTick();
        }
        if (currentWorkoutRunnerState.timerSecondsRemaining <= 0) {
          sound.playGo();
          clearInterval(currentWorkoutRunnerState.timerIntervalId);
          currentWorkoutRunnerState.isResting = false;
          renderWorkoutRunner(container);
        } else {
          renderWorkoutRunner(container);
        }
      }, 1000);
      
      renderWorkoutRunner(container);
    } else {
      // Advance to next exercise
      sound.playComplete();
      currentWorkoutRunnerState.exerciseIndex++;
      currentWorkoutRunnerState.setIndex = 1;
      currentWorkoutRunnerState.isResting = false;
      renderWorkoutRunner(container);
    }
  });

  container.querySelector('#btn-next-exercise')?.addEventListener('click', () => {
    sound.playTap();
    if (currentWorkoutRunnerState.timerIntervalId) clearInterval(currentWorkoutRunnerState.timerIntervalId);
    currentWorkoutRunnerState.exerciseIndex++;
    currentWorkoutRunnerState.setIndex = 1;
    currentWorkoutRunnerState.isResting = false;
    renderWorkoutRunner(container);
  });
}
