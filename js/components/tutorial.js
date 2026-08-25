// FitAI Smart guided first-run walkthrough
import { store } from '../state.js';

let activeStep = 0;

const STEPS = [
  {
    eyebrow: 'WELCOME TO FitAI Smart',
    icon: '⚡',
    title: 'Your day, already planned.',
    body: 'Your Advisor turns your goal, energy, schedule, and food preferences into a clear next step — without manual logging.',
    tab: 'home',
    action: 'Show my dashboard'
  },
  {
    eyebrow: 'TRAIN SMARTER',
    icon: '🏋️',
    title: 'Workouts adapt to you.',
    body: 'Choose your available equipment, session length, and how you feel. FitAI Smart adjusts the routine, volume, rest, and coaching cues.',
    tab: 'workouts',
    action: 'Explore workouts'
  },
  {
    eyebrow: 'YOUR AI COACH',
    icon: '🤖',
    title: 'Ask naturally. Get practical help.',
    body: 'Try a quick suggestion, type a question, or tap the microphone to speak. Use Listen on any response to hear your coach aloud.',
    tab: 'coach',
    action: 'Meet my coach'
  },
  {
    eyebrow: 'FUEL WITH INTENT',
    icon: '🥗',
    title: 'Nutrition that fits the moment.',
    body: 'See timed meals, hydration guidance, and instant ingredient swaps tailored to your goal and dietary preferences.',
    tab: 'nutrition',
    action: 'View nutrition'
  },
  {
    eyebrow: 'YOU’RE READY',
    icon: '✨',
    title: 'Keep FitAI Smart personal.',
    body: 'Visit Profile whenever your goal, equipment, or lifestyle changes. Re-run the quiz to recalibrate every recommendation.',
    tab: 'profile',
    action: 'Open my profile'
  }
];

export function renderTutorial(root) {
  const state = store.getState();
  if (!state.showTutorial) return;

  root.querySelector('#FitAI Smart-tutorial')?.remove();

  const step = STEPS[activeStep];
  const isLast = activeStep === STEPS.length - 1;
  const overlay = document.createElement('section');
  overlay.id = 'FitAI Smart-tutorial';
  overlay.className = 'fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm';
  overlay.innerHTML = `
    <div class="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden tutorial-card">
      <div class="h-1.5 bg-slate-800"><div class="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300" style="width: ${((activeStep + 1) / STEPS.length) * 100}%"></div></div>
      <div class="p-6 sm:p-7">
        <div class="flex items-start justify-between gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">${step.icon}</div>
          <button id="tutorial-skip" class="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1">Skip tutorial</button>
        </div>
        <p class="mt-6 text-[10px] tracking-[0.18em] font-bold text-emerald-400">${step.eyebrow}</p>
        <h2 class="mt-2 text-2xl font-extrabold text-white tracking-tight">${step.title}</h2>
        <p class="mt-3 text-sm leading-6 text-slate-300">${step.body}</p>
        <div class="flex gap-1.5 mt-6" aria-label="Tutorial progress">
          ${STEPS.map((_, index) => `<span class="h-1.5 flex-1 rounded-full ${index <= activeStep ? 'bg-emerald-400' : 'bg-slate-700'}"></span>`).join('')}
        </div>
        <div class="mt-6 flex items-center gap-3">
          ${activeStep > 0 ? '<button id="tutorial-back" class="px-4 py-3 rounded-xl text-sm font-bold text-slate-300 hover:text-white">Back</button>' : ''}
          <button id="tutorial-next" class="flex-1 min-h-12 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 text-sm font-extrabold hover:brightness-110 active:scale-[.98] transition">${isLast ? 'Finish & start training' : step.action + ' →'}</button>
        </div>
      </div>
    </div>`;
  root.appendChild(overlay);

  overlay.querySelector('#tutorial-skip')?.addEventListener('click', finishTutorial);
  overlay.querySelector('#tutorial-back')?.addEventListener('click', () => {
    activeStep -= 1;
    store.setTab(STEPS[activeStep].tab);
  });
  overlay.querySelector('#tutorial-next')?.addEventListener('click', () => {
    if (isLast) {
      store.setTab(step.tab);
      finishTutorial();
      return;
    }
    activeStep += 1;
    // setTab triggers the app render, which also redraws this modal on the next view.
    store.setTab(STEPS[activeStep].tab);
  });
}

export function startTutorial() {
  activeStep = 0;
  store.updateProfile({ showTutorial: true });
  store.setTab(STEPS[0].tab);
}

function finishTutorial() {
  activeStep = 0;
  store.updateProfile({ showTutorial: false, hasSeenTutorial: true });
}
