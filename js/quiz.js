// FitAI Smart 6-Step Personalization Quiz Wizard
import { store } from './state.js';
import { calculateMetabolicTargets } from './utils/helpers.js';

let currentQuizStep = 1;
const TOTAL_STEPS = 6;

// Local temporary quiz data
let quizData = {
  age: 26,
  gender: 'male',
  heightCm: 178,
  weightKg: 75,
  heightUnit: 'cm',
  weightUnit: 'kg',
  primaryGoal: 'muscle',
  activityLevel: 'moderate',
  equipmentAvailable: 'dumbbells',
  dietaryStyle: 'high_protein',
  allergies: ['gluten_free'],
  peakEnergyWindow: 'morning'
};

export function renderQuizView(container) {
  // Pull current profile defaults if available
  const currentProfile = store.getState();
  quizData = {
    ...quizData,
    ...currentProfile
  };

  function updateStepContent() {
    const progressPercent = Math.round((currentQuizStep / TOTAL_STEPS) * 100);

    let stepHtml = '';

    if (currentQuizStep === 1) {
      // Step 1: Biometrics
      stepHtml = `
        <div class="space-y-5 animate-in fade-in duration-300">
          <div class="text-center mb-4">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Step 1 of 6</span>
            <h2 class="text-xl sm:text-2xl font-extrabold text-white mt-2">Your Biometrics</h2>
            <p class="text-xs text-slate-400">Used by AI to calibrate your Basal Metabolic Rate (BMR) and daily energy expenditure.</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Age</label>
              <input type="number" id="quiz-age" min="14" max="99" value="${quizData.age || 26}" class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-center focus:border-emerald-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Gender Identity</label>
              <select id="quiz-gender" class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none">
                <option value="male" ${quizData.gender === 'male' ? 'selected' : ''}>Male</option>
                <option value="female" ${quizData.gender === 'female' ? 'selected' : ''}>Female</option>
                <option value="other" ${quizData.gender === 'other' ? 'selected' : ''}>Non-binary / Other</option>
              </select>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="text-xs font-semibold text-slate-300">Height (${quizData.heightUnit})</label>
                <span class="text-xs text-emerald-400 font-mono" id="height-val-display">${quizData.heightCm} cm</span>
              </div>
              <input type="range" id="quiz-height" min="140" max="220" value="${quizData.heightCm}" class="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer">
            </div>

            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="text-xs font-semibold text-slate-300">Weight (${quizData.weightUnit})</label>
                <span class="text-xs text-emerald-400 font-mono" id="weight-val-display">${quizData.weightKg} kg</span>
              </div>
              <input type="range" id="quiz-weight" min="40" max="150" value="${quizData.weightKg}" class="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer">
            </div>
          </div>
        </div>
      `;
    } else if (currentQuizStep === 2) {
      // Step 2: Primary Goal
      const goals = [
        { id: 'weight_loss', icon: '🔥', title: 'Lose Weight & Shred', desc: 'Calibrated sustainable deficit, high protein for lean preservation.' },
        { id: 'muscle', icon: '⚡', title: 'Build Lean Muscle', desc: 'Slight caloric surplus with progressive resistance loading.' },
        { id: 'endurance', icon: '🏃', title: 'Peak Athletic Endurance', desc: 'Cardiorespiratory pacing with high-carb glycogen fueling.' },
        { id: 'tone', icon: '✨', title: 'Tone & Core Strength', desc: 'Body recomposition focusing on athletic posture and metabolic conditioning.' }
      ];

      stepHtml = `
        <div class="space-y-4 animate-in fade-in duration-300">
          <div class="text-center mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Step 2 of 6</span>
            <h2 class="text-xl sm:text-2xl font-extrabold text-white mt-2">Primary Fitness Goal</h2>
            <p class="text-xs text-slate-400">The AI adapts both routine intensity and macro ratios to this target.</p>
          </div>

          <div class="space-y-2.5" id="goal-options">
            ${goals.map(g => `
              <div class="custom-option-card p-4 rounded-xl border bg-slate-900/80 flex items-center gap-3.5 ${quizData.primaryGoal === g.id ? 'selected' : 'border-slate-800'}" data-value="${g.id}" onclick="selectGoal('${g.id}')">
                <span class="text-2xl">${g.icon}</span>
                <div class="flex-1">
                  <h4 class="text-sm font-bold text-white">${g.title}</h4>
                  <p class="text-xs text-slate-400 leading-snug">${g.desc}</p>
                </div>
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center ${quizData.primaryGoal === g.id ? 'border-emerald-400 bg-emerald-500 text-slate-950' : 'border-slate-700'}">
                  ${quizData.primaryGoal === g.id ? '✓' : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (currentQuizStep === 3) {
      // Step 3: Activity Level
      const levels = [
        { id: 'sedentary', icon: '🪑', title: 'Sedentary', desc: 'Desk job, minimal daily movement (< 4,000 steps)' },
        { id: 'light', icon: '🚶', title: 'Lightly Active', desc: 'Light walking or 1-2 light sessions per week' },
        { id: 'moderate', icon: '🚴', title: 'Moderately Active', desc: 'Active lifestyle, training 3-4 days per week' },
        { id: 'active', icon: '🏋️', title: 'Very Active', desc: 'Heavy training 5-6 days per week or physical labor' },
        { id: 'athlete', icon: '⚡', title: 'Competitive Athlete', desc: 'Intense 2x/day training or competitive sports' }
      ];

      stepHtml = `
        <div class="space-y-4 animate-in fade-in duration-300">
          <div class="text-center mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Step 3 of 6</span>
            <h2 class="text-xl sm:text-2xl font-extrabold text-white mt-2">Current Activity Level</h2>
            <p class="text-xs text-slate-400">Helps the AI calculate your real Total Daily Energy Expenditure (TDEE).</p>
          </div>

          <div class="space-y-2" id="activity-options">
            ${levels.map(lvl => `
              <div class="custom-option-card p-3 rounded-xl border bg-slate-900/80 flex items-center gap-3 ${quizData.activityLevel === lvl.id ? 'selected' : 'border-slate-800'}" data-value="${lvl.id}">
                <span class="text-xl">${lvl.icon}</span>
                <div class="flex-1">
                  <h4 class="text-xs font-bold text-white">${lvl.title}</h4>
                  <p class="text-[11px] text-slate-400 leading-tight">${lvl.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (currentQuizStep === 4) {
      // Step 4: Equipment & Environment
      const eqList = [
        { id: 'gym', icon: '🏢', title: 'Full Commercial Gym', desc: 'Barbells, cables, machines, squat racks, and full dumbbell racks' },
        { id: 'dumbbells', icon: '🏋️', title: 'Dumbbells & Bench', desc: 'Pair of adjustable or fixed dumbbells and a bench/mat at home' },
        { id: 'bands', icon: '🎗️', title: 'Bands & Kettlebell', desc: 'Loop resistance bands, handles, and light kettlebell' },
        { id: 'bodyweight', icon: '🤸', title: 'Bodyweight Only', desc: 'Zero equipment needed — pure calisthenics and floor flows' }
      ];

      stepHtml = `
        <div class="space-y-4 animate-in fade-in duration-300">
          <div class="text-center mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Step 4 of 6</span>
            <h2 class="text-xl sm:text-2xl font-extrabold text-white mt-2">Available Equipment</h2>
            <p class="text-xs text-slate-400">AI routines will only use gear you actually have access to.</p>
          </div>

          <div class="space-y-2.5" id="equipment-options">
            ${eqList.map(eq => `
              <div class="custom-option-card p-3.5 rounded-xl border bg-slate-900/80 flex items-center gap-3.5 ${quizData.equipmentAvailable === eq.id ? 'selected' : 'border-slate-800'}" data-value="${eq.id}">
                <span class="text-2xl">${eq.icon}</span>
                <div class="flex-1">
                  <h4 class="text-sm font-bold text-white">${eq.title}</h4>
                  <p class="text-xs text-slate-400">${eq.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (currentQuizStep === 5) {
      // Step 5: Dietary Preferences & Restrictions
      const diets = [
        { id: 'high_protein', title: 'High Protein / Lean Clean', icon: '🥩' },
        { id: 'balanced', title: 'Balanced Whole Foods', icon: '🥗' },
        { id: 'mediterranean', title: 'Mediterranean (Fish, Olive Oil, Greens)', icon: '🐟' },
        { id: 'vegan', title: 'Plant-Based / Vegan', icon: '🌱' },
        { id: 'keto', title: 'Keto / Low-Carb High-Fat', icon: '🥑' }
      ];

      const allergiesList = [
        { id: 'gluten_free', label: 'Gluten-Free' },
        { id: 'dairy_free', label: 'Dairy-Free' },
        { id: 'nut_free', label: 'Nut-Free' },
        { id: 'halal', label: 'Halal' }
      ];

      stepHtml = `
        <div class="space-y-4 animate-in fade-in duration-300">
          <div class="text-center mb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Step 5 of 6</span>
            <h2 class="text-xl sm:text-2xl font-extrabold text-white mt-2">Diet & Preferences</h2>
            <p class="text-xs text-slate-400">Meal recommendations will be fully calibrated to these guidelines.</p>
          </div>

          <div class="space-y-1.5" id="diet-options">
            <label class="block text-xs font-semibold text-slate-300">Nutrition Style</label>
            <div class="grid grid-cols-1 gap-1.5">
              ${diets.map(d => `
                <div class="custom-option-card p-2.5 rounded-xl border bg-slate-900/80 flex items-center gap-2.5 ${quizData.dietaryStyle === d.id ? 'selected' : 'border-slate-800'}" data-value="${d.id}">
                  <span>${d.icon}</span>
                  <span class="text-xs font-bold text-white">${d.title}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Allergies & Restrictions (Select all that apply)</label>
            <div class="flex flex-wrap gap-2" id="allergies-chips">
              ${allergiesList.map(al => {
                const isSelected = quizData.allergies?.includes(al.id);
                return `
                  <button type="button" class="allergy-chip px-3 py-1.5 rounded-lg text-xs font-medium border transition ${isSelected ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}" data-id="${al.id}">
                    ${isSelected ? '✓ ' : '+ '}${al.label}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    } else if (currentQuizStep === 6) {
      // Step 6: Daily Schedule & Peak Energy Windows
      const windows = [
        { id: 'morning', icon: '🌅', title: 'Early Morning Bird (6 AM - 9 AM)', desc: 'Pre-work workout, breakfast glycogen loading' },
        { id: 'midday', icon: '☀️', title: 'Midday Energizer (12 PM - 3 PM)', desc: 'Lunchtime session or midday metabolic boost' },
        { id: 'evening', icon: '🌆', title: 'Evening Power (5 PM - 8 PM)', desc: 'Post-work decompression and strength building' },
        { id: 'night', icon: '🌙', title: 'Night Owl (8 PM - 11 PM)', desc: 'Late evening training followed by overnight recovery meal' }
      ];

      stepHtml = `
        <div class="space-y-4 animate-in fade-in duration-300">
          <div class="text-center mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Step 6 of 6</span>
            <h2 class="text-xl sm:text-2xl font-extrabold text-white mt-2">Peak Energy Window</h2>
            <p class="text-xs text-slate-400">When does your body feel most energized for physical output?</p>
          </div>

          <div class="space-y-2.5" id="energy-options">
            ${windows.map(w => `
              <div class="custom-option-card p-3.5 rounded-xl border bg-slate-900/80 flex items-center gap-3.5 ${quizData.peakEnergyWindow === w.id ? 'selected' : 'border-slate-800'}" data-value="${w.id}">
                <span class="text-2xl">${w.icon}</span>
                <div class="flex-1">
                  <h4 class="text-xs sm:text-sm font-bold text-white">${w.title}</h4>
                  <p class="text-[11px] sm:text-xs text-slate-400 leading-tight">${w.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-slate-950 text-slate-100 relative overflow-hidden">
        <!-- Ambient background gradients -->
        <div class="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="w-full max-w-md glass-card p-6 sm:p-8 relative z-10 border border-slate-800 shadow-2xl">
          
          <!-- Top Step Progress Bar -->
          <div class="mb-6">
            <div class="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
              <span>Personalization Quiz</span>
              <span class="text-emerald-400 font-mono">${progressPercent}%</span>
            </div>
            <div class="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300" style="width: ${progressPercent}%;"></div>
            </div>
          </div>

          <!-- Dynamic Step Content -->
          <div id="quiz-step-container">
            ${stepHtml}
          </div>

          <!-- Bottom Action Buttons -->
          <div class="flex items-center gap-3 mt-8 pt-4 border-t border-slate-800/80">
            ${currentQuizStep > 1 ? `
              <button id="btn-quiz-prev" class="px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs font-bold transition">
                ← Back
              </button>
            ` : ''}

            <button id="btn-quiz-next" class="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition active:scale-[0.98]">
              ${currentQuizStep === TOTAL_STEPS ? '⚡ Generate AI Plan' : 'Continue →'}
            </button>
          </div>

        </div>
      </div>
    `;

    bindStepListeners();
  }

  function bindStepListeners() {
    const btnNext = container.querySelector('#btn-quiz-next');
    const btnPrev = container.querySelector('#btn-quiz-prev');

    // Step 1 listeners
    if (currentQuizStep === 1) {
      const ageInput = container.querySelector('#quiz-age');
      const genderSelect = container.querySelector('#quiz-gender');
      const heightRange = container.querySelector('#quiz-height');
      const weightRange = container.querySelector('#quiz-weight');
      const heightDisplay = container.querySelector('#height-val-display');
      const weightDisplay = container.querySelector('#weight-val-display');

      ageInput?.addEventListener('input', (e) => { quizData.age = Number(e.target.value); });
      genderSelect?.addEventListener('change', (e) => { quizData.gender = e.target.value; });
      heightRange?.addEventListener('input', (e) => {
        quizData.heightCm = Number(e.target.value);
        if (heightDisplay) heightDisplay.textContent = quizData.heightCm + ' cm';
      });
      weightRange?.addEventListener('input', (e) => {
        quizData.weightKg = Number(e.target.value);
        if (weightDisplay) weightDisplay.textContent = quizData.weightKg + ' kg';
      });
    }

    // Option cards selection for steps 2, 3, 4, 5, 6
    container.querySelectorAll('.custom-option-card').forEach(card => {
      card.addEventListener('click', () => {
        const val = card.getAttribute('data-value');
        if (currentQuizStep === 2) quizData.primaryGoal = val;
        if (currentQuizStep === 3) quizData.activityLevel = val;
        if (currentQuizStep === 4) quizData.equipmentAvailable = val;
        if (currentQuizStep === 5) quizData.dietaryStyle = val;
        if (currentQuizStep === 6) quizData.peakEnergyWindow = val;

        container.querySelectorAll('.custom-option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });

    // Allergy chips toggle (multi-select)
    container.querySelectorAll('.allergy-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const id = chip.getAttribute('data-id');
        let currentAllergies = quizData.allergies || [];
        if (currentAllergies.includes(id)) {
          currentAllergies = currentAllergies.filter(item => item !== id);
        } else {
          currentAllergies.push(id);
        }
        quizData.allergies = currentAllergies;
        updateStepContent();
      });
    });

    // Back button
    btnPrev?.addEventListener('click', () => {
      if (currentQuizStep > 1) {
        currentQuizStep--;
        updateStepContent();
      }
    });

    // Next / Complete button
    btnNext?.addEventListener('click', () => {
      if (currentQuizStep < TOTAL_STEPS) {
        currentQuizStep++;
        updateStepContent();
      } else {
        // Finish Quiz -> Trigger Animated AI Synthesis Screen
        showAiSynthesisScreen();
      }
    });
  }

  function showAiSynthesisScreen() {
    container.innerHTML = `
      <div class="min-h-screen flex flex-col justify-center items-center p-6 bg-slate-950 text-slate-100 text-center relative overflow-hidden">
        <div class="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-400 to-cyan-400 p-0.5 animate-pulse-ring mb-6">
          <div class="w-full h-full bg-slate-950 rounded-3xl flex items-center justify-center">
            <svg class="w-12 h-12 text-emerald-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>

        <h2 class="text-2xl font-extrabold text-white mb-2">Calibrating Your AI Engine</h2>
        <p id="synthesis-status-text" class="text-sm text-emerald-400 font-mono mb-6">Analyzing metabolic BMR & TDEE...</p>

        <!-- Progress Steps Animation -->
        <div class="w-full max-w-xs space-y-2 text-left text-xs text-slate-400 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div class="flex items-center gap-2 text-emerald-400" id="step-status-1">
            <span>✓</span> <span>Metabolic & TDEE Calculations Complete</span>
          </div>
          <div class="flex items-center gap-2 text-slate-500" id="step-status-2">
            <span>○</span> <span>Optimizing Pre/Post-Workout Carb Splits</span>
          </div>
          <div class="flex items-center gap-2 text-slate-500" id="step-status-3">
            <span>○</span> <span>Synthesizing Adaptive 7-Day Routine</span>
          </div>
        </div>
      </div>
    `;

    const statusText = container.querySelector('#synthesis-status-text');
    const step2 = container.querySelector('#step-status-2');
    const step3 = container.querySelector('#step-status-3');

    setTimeout(() => {
      if (statusText) statusText.textContent = "Synthesizing nutrient timing windows...";
      if (step2) {
        step2.className = "flex items-center gap-2 text-emerald-400";
        step2.innerHTML = "<span>✓</span> <span>Optimizing Pre/Post-Workout Carb Splits</span>";
      }
    }, 900);

    setTimeout(() => {
      if (statusText) statusText.textContent = "Personalizing AI Coach prompts & routines...";
      if (step3) {
        step3.className = "flex items-center gap-2 text-emerald-400";
        step3.innerHTML = "<span>✓</span> <span>Synthesizing Adaptive 7-Day Routine</span>";
      }
    }, 1800);

    setTimeout(() => {
      // Calculate and save finalized profile
      const targets = calculateMetabolicTargets(quizData);
      store.updateProfile({
        ...quizData,
        targets,
        hasCompletedQuiz: true,
        isLoggedIn: true
      });
      store.setAuthMode('app');
      store.setTab('home');
    }, 2700);
  }

  function selectGoal(goalId) {
  quizData.primaryGoal = goalId;
  updateStepContent();
  }
}
