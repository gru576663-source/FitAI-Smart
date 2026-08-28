// Fit AI App Proactive Nutrition & Meal Assistant
import { store } from '../state.js';
import { AI_ENGINE } from '../aiEngine.js';
import { sound } from '../utils/audio.js';

let activeSwapMealTarget = null;

export function renderNutritionView(container) {
  const profile = store.getState();
  const targets = profile.targets || { targetCalories: 2200, targetProtein: 165, targetCarbs: 230, targetFat: 60, waterTarget: 2800 };
  const nutritionSchedule = AI_ENGINE.getProactiveNutritionSchedule(profile);
  const currentWater = profile.waterIntakeCurrent || 1500;
  const waterPercent = Math.min(100, Math.round((currentWater / targets.waterTarget) * 100));

  container.innerHTML = `
    <div class="space-y-6 pb-24 animate-in fade-in duration-300">
      
      <!-- Top Header & Dietary Badge -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <span>Proactive Nutrition Engine</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white">AI Nutrition & Meal Schedule</h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-0.5">Chronologically timed fuel calibrated to your workout window</p>
        </div>

        <div class="flex items-center gap-2">
          <span class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <span>🥗</span> <span class="capitalize">${profile.dietaryStyle.replace('_', ' ')}</span>
          </span>
          <button id="btn-open-pantry-swap-general" class="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95 flex items-center gap-1.5">
            <span>🔄</span> <span>Pantry Swap</span>
          </button>
        </div>
      </div>

      <!-- Macro & Calorie Targets Card -->
      <div class="glass-card p-5 sm:p-6 border border-slate-800 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">AI Daily Energy Target</span>
            <div class="text-3xl font-extrabold text-white font-mono mt-0.5">
              ${targets.targetCalories} <span class="text-sm font-sans font-semibold text-slate-400">kcal/day</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              ${profile.primaryGoal === 'weight_loss' ? '🔥 450 kcal Deficit' : (profile.primaryGoal === 'muscle' ? '⚡ 300 kcal Surplus' : '⚖️ Energy Balance')}
            </span>
          </div>
        </div>

        <!-- 3-Macro Breakdown Bars -->
        <div class="grid grid-cols-3 gap-3 pt-2">
          
          <!-- Protein Target -->
          <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div class="flex justify-between items-center text-xs mb-1">
              <span class="font-bold text-emerald-400">Protein</span>
              <span class="font-mono text-slate-400">${targets.targetProtein}g</span>
            </div>
            <div class="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-400 w-full"></div>
            </div>
            <span class="text-[10px] text-slate-500 mt-1 block">Muscle Recovery</span>
          </div>

          <!-- Carbs Target -->
          <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div class="flex justify-between items-center text-xs mb-1">
              <span class="font-bold text-cyan-400">Carbs</span>
              <span class="font-mono text-slate-400">${targets.targetCarbs}g</span>
            </div>
            <div class="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div class="h-full bg-cyan-400 w-full"></div>
            </div>
            <span class="text-[10px] text-slate-500 mt-1 block">Glycogen Energy</span>
          </div>

          <!-- Fats Target -->
          <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div class="flex justify-between items-center text-xs mb-1">
              <span class="font-bold text-amber-400">Fats</span>
              <span class="font-mono text-slate-400">${targets.targetFat}g</span>
            </div>
            <div class="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div class="h-full bg-amber-400 w-full"></div>
            </div>
            <span class="text-[10px] text-slate-500 mt-1 block">Hormone Health</span>
          </div>

        </div>
      </div>

      <!-- Smart Hydration Tracker & Pacing -->
      <div class="glass-card p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-2xl">
            💧
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-white">Smart Hydration Engine</h3>
              <span class="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">${waterPercent}% TARGET</span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">
              Logged: <strong class="text-white font-mono">${currentWater} mL</strong> / ${targets.waterTarget} mL target today
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button id="btn-add-water" class="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition active:scale-95 flex items-center justify-center gap-1">
            <span>+ 250ml Glass</span>
          </button>
          <button id="btn-reset-water" class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs" title="Reset Water">
            ↺
          </button>
        </div>
      </div>

      <!-- Timed Meal Recommendations List -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span>⏱️ Chronological Meal Recommendations</span>
          </h3>
          <span class="text-[11px] text-slate-500">Auto-calibrated portions</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${nutritionSchedule.meals.map(meal => `
            <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4">
              
              <!-- Card Top -->
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <span class="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-emerald-400">${meal.timing}</span>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">${meal.type.replace(/([A-Z])/g, ' $1')}</span>
                </div>
                
                <h4 class="text-base font-extrabold text-white leading-tight">${meal.title}</h4>
                <p class="text-xs text-slate-400 mt-1 italic leading-relaxed">"${meal.aiWhy}"</p>
              </div>

              <!-- Macros Pill -->
              <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono">
                <span class="text-slate-200 font-bold">${meal.calories} kcal</span>
                <span class="text-emerald-400 font-bold">${meal.protein}g P</span>
                <span class="text-cyan-400 font-bold">${meal.carbs}g C</span>
                <span class="text-amber-400 font-bold">${meal.fat}g F</span>
              </div>

              <!-- Ingredients -->
              <div class="space-y-1 text-xs text-slate-300">
                <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Key Ingredients:</div>
                <div class="flex flex-wrap gap-1.5">
                  ${meal.ingredients.map(ing => `
                    <span class="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[11px] border border-slate-700/60">${ing}</span>
                  `).join('')}
                </div>
              </div>

              <!-- Action Swap Button -->
              <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span class="text-[11px] text-slate-400">Prep: ${meal.prepTime}</span>
                <button class="btn-swap-single-meal px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition flex items-center gap-1" data-meal-title="${meal.title}" data-calories="${meal.calories}" data-protein="${meal.protein}" data-carbs="${meal.carbs}" data-fat="${meal.fat}">
                  <span>🔄</span> <span>Swap with Pantry</span>
                </button>
              </div>

            </div>
          `).join('')}
        </div>
      </div>

    </div>

    <!-- Instant Pantry Swap Modal -->
    <div id="pantry-swap-modal" class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md hidden flex items-center justify-center p-4">
      <div class="glass-card max-w-lg w-full p-6 border border-slate-700 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <button id="close-pantry-modal" class="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">✕</button>
        
        <div class="flex items-center gap-2.5 mb-4">
          <span class="text-2xl">🔄</span>
          <div>
            <h3 class="text-base font-extrabold text-white">Instant Food Swap & Pantry Match</h3>
            <p class="text-xs text-slate-400" id="swap-modal-subtitle">Missing ingredients? AI will calibrate an alternative with exact matching macros.</p>
          </div>
        </div>

        <!-- Pantry Input Form -->
        <form id="pantry-swap-form" class="space-y-3 mb-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">What do you have available right now?</label>
            <input 
              type="text" 
              id="pantry-input" 
              placeholder="e.g. '3 eggs, sourdough, and avocado' or 'canned tuna and rice'" 
              class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
            >
          </div>
          <button type="submit" class="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition">
            ⚡ Generate Calibrated Macro Match
          </button>
        </form>

        <!-- Swap Result Container -->
        <div id="swap-result-box" class="hidden p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
          <!-- Dynamically populated -->
        </div>

      </div>
    </div>
  `;

  // Attach Listeners
  // Water buttons
  container.querySelector('#btn-add-water')?.addEventListener('click', () => {
    sound.playTap();
    store.addWater(250);
    renderNutritionView(container);
  });

  container.querySelector('#btn-reset-water')?.addEventListener('click', () => {
    sound.playTap();
    store.resetWater();
    renderNutritionView(container);
  });

  // Pantry Modal logic
  const pantryModal = container.querySelector('#pantry-swap-modal');
  const closePantryModal = container.querySelector('#close-pantry-modal');
  const pantryForm = container.querySelector('#pantry-swap-form');
  const pantryInput = container.querySelector('#pantry-input');
  const swapResultBox = container.querySelector('#swap-result-box');
  const swapSubtitle = container.querySelector('#swap-modal-subtitle');
  const btnGeneralSwap = container.querySelector('#btn-open-pantry-swap-general');

  btnGeneralSwap?.addEventListener('click', () => {
    sound.playTap();
    activeSwapMealTarget = {
      title: 'Current Recommended Meal',
      calories: 520,
      protein: 42,
      carbs: 50,
      fat: 16
    };
    if (swapSubtitle) swapSubtitle.textContent = `Swapping for target: 520 kcal (${activeSwapMealTarget.protein}g Protein)`;
    pantryModal?.classList.remove('hidden');
  });

  closePantryModal?.addEventListener('click', () => {
    pantryModal?.classList.add('hidden');
  });

  container.querySelectorAll('.btn-swap-single-meal').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playTap();
      const title = btn.getAttribute('data-meal-title');
      const calories = Number(btn.getAttribute('data-calories'));
      const protein = Number(btn.getAttribute('data-protein'));
      const carbs = Number(btn.getAttribute('data-carbs'));
      const fat = Number(btn.getAttribute('data-fat'));

      activeSwapMealTarget = { title, calories, protein, carbs, fat };
      if (swapSubtitle) swapSubtitle.textContent = `Swapping for "${title}" (${calories} kcal, ${protein}g Protein)`;
      pantryModal?.classList.remove('hidden');
    });
  });

  pantryForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    sound.playGo();
    const query = pantryInput.value.trim();
    const swap = AI_ENGINE.generatePantrySwap(activeSwapMealTarget, query, profile);

    if (swapResultBox) {
      swapResultBox.classList.remove('hidden');
      swapResultBox.innerHTML = `
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <h4 class="text-sm font-extrabold text-emerald-400">${swap.title}</h4>
          <span class="text-[10px] font-mono text-slate-400">${swap.servings}</span>
        </div>

        <div class="flex justify-between items-center p-2 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px]">
          <span class="text-white font-bold">${swap.calories} kcal</span>
          <span class="text-emerald-400 font-bold">${swap.protein}g Protein</span>
          <span class="text-cyan-400 font-bold">${swap.carbs}g Carbs</span>
          <span class="text-amber-400 font-bold">${swap.fat}g Fats</span>
        </div>

        <div class="space-y-1">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Calibrated Ingredients:</div>
          <ul class="space-y-1 text-slate-200">
            ${swap.matchedIngredients.map(ing => `<li>• ${ing}</li>`).join('')}
          </ul>
        </div>

        <div class="space-y-1">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Express Prep:</div>
          <ul class="space-y-1 text-slate-300">
            ${swap.prepInstructions.map(step => `<li>${step}</li>`).join('')}
          </ul>
        </div>

        <div class="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-start gap-2">
          <span>💡</span>
          <div>${swap.aiCoachRationale}</div>
        </div>
      `;
    }
  });
}
