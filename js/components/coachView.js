// Fit AI App AI Coach & Real-Time Conversational Assistant
import { store } from '../state.js';
import { AI_ENGINE } from '../aiEngine.js';
import { sound } from '../utils/audio.js';
import { speakText, stopSpeaking } from '../utils/helpers.js';

let isGenerating = false;
let currentlySpeakingMessageId = null;
let recognition = null;

export function renderCoachView(container) {
  const profile = store.getState();
  const messages = profile.chatMessages || [];

  container.innerHTML = `
    <div class="flex flex-col h-[calc(100vh-10rem)] max-w-3xl mx-auto pb-4 animate-in fade-in duration-300">
      
      <!-- Coach Header Bar -->
      <div class="glass-card px-4 py-3 border border-slate-800 flex items-center justify-between gap-3 mb-3">
        <div class="flex items-center gap-3">
          <div class="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-400 p-0.5 shadow-md shadow-emerald-500/20">
            <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-lg">
              🤖
            </div>
            <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full"></span>
          </div>

          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-sm font-extrabold text-white">Fit AI Coach</h2>
              <span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">ONLINE</span>
            </div>
            <p class="text-[11px] text-slate-400">Personalized to: <strong class="text-slate-300">${profile.name} (${profile.primaryGoal.replace('_', ' ')})</strong></p>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <button id="btn-quick-form-guides" class="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 transition" title="Form Masterclass">
            <span>🎯</span> <span class="hidden sm:inline">Form Guides</span>
          </button>

          <button id="btn-clear-chat" class="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-rose-400 transition text-xs" title="Clear Chat History">
            🗑️
          </button>
        </div>
      </div>

      <!-- Chat Messages Scroll Container -->
      <div id="chat-messages-container" class="flex-1 overflow-y-auto space-y-4 px-1 pr-2 py-2">
        ${messages.map(msg => renderMessageCard(msg)).join('')}
        
        <!-- Live Streaming Bubble (if generating) -->
        <div id="streaming-bubble-container" class="hidden"></div>
      </div>

      <!-- Context Quick-Reply Chips -->
      <div class="py-2 overflow-x-auto no-scrollbar">
        <div class="flex items-center gap-2" id="quick-chips-wrapper">
          <button class="coach-chip flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-xs font-medium text-slate-300 hover:text-white transition active:scale-95 flex items-center gap-1.5" data-prompt="What should I workout today?">
            <span>🏋️</span> <span>Workout for today</span>
          </button>
          <button class="coach-chip flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-xs font-medium text-slate-300 hover:text-white transition active:scale-95 flex items-center gap-1.5" data-prompt="Suggest a 20-min dumbbell routine">
            <span>⏱️</span> <span>20-min quick routine</span>
          </button>
          <button class="coach-chip flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-xs font-medium text-slate-300 hover:text-white transition active:scale-95 flex items-center gap-1.5" data-prompt="Give me key form tips for squats">
            <span>🎯</span> <span>Squat form check</span>
          </button>
          <button class="coach-chip flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-xs font-medium text-slate-300 hover:text-white transition active:scale-95 flex items-center gap-1.5" data-prompt="I'm feeling sore in my lower back, what should I do?">
            <span>🛡️</span> <span>Lower back soreness</span>
          </button>
          <button class="coach-chip flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-xs font-medium text-slate-300 hover:text-white transition active:scale-95 flex items-center gap-1.5" data-prompt="What is the best post-workout meal for my goals?">
            <span>🥑</span> <span>Post-workout meal</span>
          </button>
        </div>
      </div>

      <!-- Bottom Chat Input Bar -->
      <form id="coach-input-form" class="mt-1 relative">
        <div class="relative flex items-center">
          <input 
            type="text" 
            id="coach-user-input" 
            placeholder="Ask your coach (e.g., 'Suggest a 15-min core burn' or 'Form check on deadlift')..." 
            autocomplete="off"
            class="w-full pl-4 pr-32 py-3.5 rounded-2xl bg-slate-900/95 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-xl"
          >
          <button
            type="button"
            id="btn-voice-message"
            class="absolute right-[4.8rem] p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition"
            title="Speak to your AI Coach"
            aria-label="Speak to your AI Coach"
          >
            🎙️
          </button>
          <button 
            type="submit" 
            id="btn-send-message" 
            class="absolute right-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-md transition active:scale-95 flex items-center gap-1"
          >
            <span>Send</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </form>

    </div>

    <!-- Quick Form Masterclass Modal -->
    <div id="form-guide-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md hidden flex items-center justify-center p-4">
      <div class="glass-card max-w-lg w-full p-6 border border-slate-700 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <button id="close-form-modal" class="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">✕</button>
        
        <div class="flex items-center gap-2.5 mb-4">
          <span class="text-2xl">🎯</span>
          <div>
            <h3 class="text-base font-extrabold text-white">Biomechanical Form Masterclass</h3>
            <p class="text-xs text-slate-400">Select any foundational movement for AI safety cues & common fixes</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 mb-4" id="form-exercise-picker">
          <button class="form-pick-btn p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-bold text-slate-200 hover:border-emerald-500 transition text-left" data-ex="Squats">
            🏋️ Barbell Squats
          </button>
          <button class="form-pick-btn p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-bold text-slate-200 hover:border-emerald-500 transition text-left" data-ex="Deadlift">
            ⚡ Conventional Deadlift
          </button>
          <button class="form-pick-btn p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-bold text-slate-200 hover:border-emerald-500 transition text-left" data-ex="Bench Press">
            💪 Barbell Bench Press
          </button>
          <button class="form-pick-btn p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-bold text-slate-200 hover:border-emerald-500 transition text-left" data-ex="Push-Up">
            🤸 Perfect Push-Up
          </button>
        </div>

        <div id="form-guide-details" class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
          Click any movement above to inspect AI biomechanical cues.
        </div>
      </div>
    </div>
  `;

  const chatContainer = container.querySelector('#chat-messages-container');
  const inputForm = container.querySelector('#coach-input-form');
  const userInput = container.querySelector('#coach-user-input');
  const streamingBubble = container.querySelector('#streaming-bubble-container');
  const voiceButton = container.querySelector('#btn-voice-message');
  const btnClear = container.querySelector('#btn-clear-chat');
  const btnFormGuides = container.querySelector('#btn-quick-form-guides');
  const formModal = container.querySelector('#form-guide-modal');
  const closeFormModal = container.querySelector('#close-form-modal');

  // Scroll to bottom
  if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;

  // Clear chat handler
  btnClear?.addEventListener('click', () => {
    sound.playTap();
    store.clearChat();
    renderCoachView(container);
  });

  // Form guides modal
  btnFormGuides?.addEventListener('click', () => {
    sound.playTap();
    formModal?.classList.remove('hidden');
  });

  closeFormModal?.addEventListener('click', () => {
    formModal?.classList.add('hidden');
  });

  container.querySelectorAll('.form-pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playTap();
      const ex = btn.getAttribute('data-ex');
      formModal?.classList.add('hidden');
      sendUserQuery(`Form tip for ${ex}`);
    });
  });

  // Attach quick-chip click handlers
  container.querySelectorAll('.coach-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      sound.playTap();
      const prompt = chip.getAttribute('data-prompt');
      sendUserQuery(prompt);
    });
  });

  // Listen for custom event from Home view
  window.addEventListener('FitAI Smart:sendCoachQuery', (e) => {
    if (e.detail && e.detail.query) {
      sendUserQuery(e.detail.query);
    }
  }, { once: true });

  // Handle Form Submit
  inputForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = userInput.value.trim();
    if (!query || isGenerating) return;
    sendUserQuery(query);
    userInput.value = '';
  });

  // Optional browser voice input. This stays fully client-side and gracefully
  // falls back to the regular text field on browsers without speech recognition.
  voiceButton?.addEventListener('click', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      userInput.placeholder = 'Voice input is unavailable here — type your question instead.';
      userInput.focus();
      return;
    }

    if (recognition) {
      recognition.stop();
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = navigator.language || 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    voiceButton.classList.add('text-rose-400', 'animate-pulse');
    voiceButton.textContent = '⏹️';
    userInput.placeholder = 'Listening…';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) transcript += event.results[i][0].transcript;
      userInput.value = transcript.trim();
    };

    recognition.onerror = () => {
      userInput.placeholder = 'Couldn’t hear that — try again or type your question.';
    };

    recognition.onend = () => {
      recognition = null;
      voiceButton.classList.remove('text-rose-400', 'animate-pulse');
      voiceButton.textContent = '🎙️';
      if (!userInput.value) userInput.placeholder = "Ask your coach (e.g., 'Suggest a 15-min core burn' or 'Form check on deadlift')...";
      userInput.focus();
    };

    recognition.start();
  });

  // Function to process user question
  async function sendUserQuery(text) {
    if (isGenerating) return;
    isGenerating = true;

    // 1. Add User Message
    store.addChatMessage({
      sender: 'user',
      text: text
    });

    renderCoachView(container);
    const updatedChatContainer = container.querySelector('#chat-messages-container');
    if (updatedChatContainer) updatedChatContainer.scrollTop = updatedChatContainer.scrollHeight;

    // 2. Setup streaming bubble
    const streamContainer = container.querySelector('#streaming-bubble-container');
    if (streamContainer) {
      streamContainer.className = 'flex items-start gap-3 animate-in fade-in duration-200';
      streamContainer.innerHTML = `
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-400 p-0.5 flex-shrink-0">
          <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-sm">
            🤖
          </div>
        </div>
        <div class="max-w-[85%] rounded-2xl px-4 py-3 bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200 shadow-md">
          <div class="ai-markdown leading-relaxed typing-cursor" id="streaming-text-target">
            Thinking...
          </div>
        </div>
      `;
      if (updatedChatContainer) updatedChatContainer.scrollTop = updatedChatContainer.scrollHeight;
    }

    const currentProfile = store.getState();
    const streamTarget = container.querySelector('#streaming-text-target');

    // 3. Process with AI Engine
    const result = await AI_ENGINE.processCoachQuery(text, currentProfile, (accumulatedText, isDone) => {
      if (streamTarget) {
        streamTarget.innerHTML = formatMarkdown(accumulatedText);
        if (updatedChatContainer) updatedChatContainer.scrollTop = updatedChatContainer.scrollHeight;
      }
    });

    // 4. Save Final AI Message to store
    store.addChatMessage({
      sender: 'ai',
      text: result.text,
      quickSuggestions: result.quickSuggestions
    });

    isGenerating = false;
    renderCoachView(container);
  }

  // Bind audio TTS listeners on AI message bubbles
  bindAudioSpeechButtons(container);
}

function renderMessageCard(msg) {
  const isAi = msg.sender === 'ai';
  const timeStr = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  if (!isAi) {
    return `
      <div class="flex justify-end animate-in fade-in duration-200">
        <div class="max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-3 bg-emerald-500 text-slate-950 font-medium text-xs sm:text-sm shadow-lg shadow-emerald-500/10">
          <div>${escapeHtml(msg.text)}</div>
          <div class="text-[10px] text-emerald-950/70 text-right mt-1 font-mono">${timeStr}</div>
        </div>
      </div>
    `;
  }

  return `
    <div class="flex items-start gap-3 animate-in fade-in duration-200">
      <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-400 p-0.5 flex-shrink-0 mt-1 shadow-sm">
        <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-sm">
          🤖
        </div>
      </div>

      <div class="max-w-[88%] rounded-2xl rounded-tl-sm px-4 py-3.5 bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200 shadow-md">
        <div class="ai-markdown leading-relaxed">
          ${formatMarkdown(msg.text)}
        </div>

        <div class="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
          <span class="font-mono">${timeStr}</span>
          
          <div class="flex items-center gap-2">
            <button class="btn-speak-msg px-2 py-0.5 rounded bg-slate-950 border border-slate-800 hover:text-emerald-400 transition flex items-center gap-1" data-msg-id="${msg.id}" data-text="${escapeHtml(msg.text)}">
              <span>🔊</span> <span>Listen</span>
            </button>
            <button class="btn-copy-msg px-2 py-0.5 rounded bg-slate-950 border border-slate-800 hover:text-slate-200 transition" data-text="${escapeHtml(msg.text)}">
              📋 Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindAudioSpeechButtons(container) {
  container.querySelectorAll('.btn-speak-msg').forEach(btn => {
    btn.addEventListener('click', () => {
      const msgId = btn.getAttribute('data-msg-id');
      const text = btn.getAttribute('data-text');

      if (currentlySpeakingMessageId === msgId) {
        stopSpeaking();
        currentlySpeakingMessageId = null;
        btn.innerHTML = '<span>🔊</span> <span>Listen</span>';
      } else {
        stopSpeaking();
        currentlySpeakingMessageId = msgId;
        btn.innerHTML = '<span class="text-emerald-400 animate-pulse">⏹️</span> <span class="text-emerald-400">Playing</span>';
        speakText(text, () => {
          currentlySpeakingMessageId = null;
          btn.innerHTML = '<span>🔊</span> <span>Listen</span>';
        });
      }
    });
  });

  container.querySelectorAll('.btn-copy-msg').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-text');
      navigator.clipboard?.writeText(text);
      btn.textContent = '✓ Copied';
      setTimeout(() => { btn.textContent = '📋 Copy'; }, 2000);
    });
  });
}

function formatMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gim, '<h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mt-2 mb-1">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="text-sm font-extrabold text-white mt-3 mb-1.5">$1</h3>')
    .replace(/^> (.*$)/gim, '<blockquote class="p-2.5 rounded-lg bg-emerald-500/10 border-l-2 border-emerald-400 text-emerald-300 text-xs my-2">$1</blockquote>')
    .replace(/\n\n/g, '<p class="my-2"></p>')
    .replace(/\n/g, '<br>');
}

function escapeHtml(unsafe) {
  return (unsafe || '')
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
