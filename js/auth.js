// FitAI Smart Authentication Screen & Flow Logic
import { store } from './state.js';

export function renderAuthView(container) {
  const authMode = store.getAuthMode(); // 'login' | 'signup' | 'forgot' | 'splash'

  container.innerHTML = `
    <div class="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <!-- Background Ambient Glow Orbs -->
      <div class="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Main Container Card -->
      <div class="w-full max-w-md glass-card p-6 sm:p-8 relative z-10 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
        
        <!-- Header & Logo -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/25 mb-3">
            <svg class="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            FitAI Smart
          </h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            AI-Driven Fitness & Nutrition Intelligence
          </p>
        </div>

        <!-- Dynamic Auth Tabs (Login / Sign Up) -->
        <div class="flex p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-6">
          <button id="tab-btn-login" class="flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMode !== 'signup' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}">
            Log In
          </button>
          <button id="tab-btn-signup" class="flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMode === 'signup' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}">
            Sign Up
          </button>
        </div>

        <!-- Social Login Buttons -->
        <div class="space-y-2.5 mb-6">
          <button id="btn-google-login" class="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-sm font-medium text-slate-200 transition active:scale-[0.98] shadow-sm">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8 0-1.3.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
            </svg>
            Continue with Google
          </button>
          
          <button id="btn-apple-login" class="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-sm font-medium text-slate-200 transition active:scale-[0.98] shadow-sm">
            <svg class="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.98.6-2.62 1.35-.57.65-1.06 1.7-0.93 2.73 1 .08 2.01-.48 2.63-1.23z"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        <div class="relative flex py-2 items-center mb-6">
          <div class="flex-grow border-t border-slate-800"></div>
          <span class="flex-shrink mx-3 text-xs font-semibold uppercase tracking-wider text-slate-500">or with email</span>
          <div class="flex-grow border-t border-slate-800"></div>
        </div>

        <!-- Login Form -->
        <form id="auth-login-form" class="space-y-4 ${authMode === 'signup' ? 'hidden' : 'block'}">
          <div id="login-error" class="hidden p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-medium"></div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div class="relative">
              <input type="email" id="login-email" required value="alex.rivera@FitAI Smart.ai" placeholder="you@example.com" class="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition">
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-1.5">
              <label class="block text-xs font-medium text-slate-300">Password</label>
              <button type="button" id="btn-forgot-password" class="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition">
                Forgot password?
              </button>
            </div>
            <div class="relative">
              <input type="password" id="login-password" required value="pulse12345" placeholder="••••••••" class="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition">
              <button type="button" id="toggle-login-pwd" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs">
                Show
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <input type="checkbox" id="remember-me" checked class="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950">
            <label for="remember-me" class="text-xs text-slate-400">Remember me on this device</label>
          </div>

          <button type="submit" class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition active:scale-[0.98] mt-2">
            Sign In to FitAI Smart
          </button>
        </form>

        <!-- Sign Up Form -->
        <form id="auth-signup-form" class="space-y-4 ${authMode === 'signup' ? 'block' : 'hidden'}">
          <div id="signup-error" class="hidden p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-medium"></div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
            <input type="text" id="signup-name" required placeholder="Marcus Vance" class="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition">
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <input type="email" id="signup-email" required placeholder="marcus@example.com" class="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition">
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div class="relative">
              <input type="password" id="signup-password" required placeholder="enter your password" class="w-full px-4 py-3 rounded-xl bg-slate-900/90  text-slate-100 placeholder-slate-500 text-sm focus:outline-none  focus:ring-1 focus:ring-emerald-500 transition">
              <button type="button" id="toggle-signup-pwd" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs">
                Show
              </button>
            </div>
            

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1.5">Phone Number <span class="text-slate-500 font-normal">(Optional for SMS alerts)</span></label>
            <input type="tel" id="signup-phone" placeholder="+1 (555) 000-0000" class="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition">
          </div>

          <div class="flex items-start gap-2 pt-1">
            <input type="checkbox" id="terms-agree" required checked class="mt-0.5 w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500">
            <label for="terms-agree" class="text-xs text-slate-400">
              I agree to the <span class="text-slate-300 underline">Terms of Service</span> & <span class="text-slate-300 underline">AI Privacy Policy</span>
            </label>
          </div>

          <button type="submit" class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition active:scale-[0.98]">
            Continue to Personalization Quiz →
          </button>
        </form>

        <!-- Quick Instant Demo / Guest Login -->
        <div class="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <button id="btn-quick-demo" class="text-xs text-slate-400 hover:text-emerald-400 font-medium transition flex items-center justify-center gap-1.5 mx-auto">
            <span>⚡ Instant Demo Mode (Pre-configured Profile)</span>
          </button>
        </div>

      </div>

      <!-- Forgot Password Modal Dialog -->
      <div id="forgot-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm hidden flex items-center justify-center p-4">
        <div class="glass-card max-w-sm w-full p-6 border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in duration-200">
          <button id="close-forgot-modal" class="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">✕</button>
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-white mb-1">Reset Password</h3>
          <p class="text-xs text-slate-400 mb-4">Enter your registered email address and our AI system will send a secure reset link.</p>
          <form id="forgot-form" class="space-y-3">
            <input type="email" id="forgot-email" required placeholder="name@example.com" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500">
            <button type="submit" class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition">
              Send Reset Instructions
            </button>
          </form>
          <div id="forgot-success" class="hidden mt-3 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs">
            ✓ Reset link sent! Check your inbox.
          </div>
        </div>
      </div>

    </div>
  `;

  // Attach Event Listeners
  const loginForm = container.querySelector('#auth-login-form');
  const signupForm = container.querySelector('#auth-signup-form');
  const tabLogin = container.querySelector('#tab-btn-login');
  const tabSignup = container.querySelector('#tab-btn-signup');
  const btnGoogle = container.querySelector('#btn-google-login');
  const btnApple = container.querySelector('#btn-apple-login');
  const btnQuickDemo = container.querySelector('#btn-quick-demo');
  const btnForgot = container.querySelector('#btn-forgot-password');
  const forgotModal = container.querySelector('#forgot-modal');
  const closeForgotModal = container.querySelector('#close-forgot-modal');
  const forgotForm = container.querySelector('#forgot-form');
  const toggleLoginPwd = container.querySelector('#toggle-login-pwd');
  const toggleSignupPwd = container.querySelector('#toggle-signup-pwd');
  const loginPwdInput = container.querySelector('#login-password');
  const signupPwdInput = container.querySelector('#signup-password');

  // Toggle Login/Signup tabs
  tabLogin?.addEventListener('click', () => {
    store.setAuthMode('login');
  });

  tabSignup?.addEventListener('click', () => {
    store.setAuthMode('signup');
  });

  // Password visibility toggles
  toggleLoginPwd?.addEventListener('click', () => {
    if (loginPwdInput.type === 'password') {
      loginPwdInput.type = 'text';
      toggleLoginPwd.textContent = 'Hide';
    } else {
      loginPwdInput.type = 'password';
      toggleLoginPwd.textContent = 'Show';
    }
  });

  toggleSignupPwd?.addEventListener('click', () => {
    if (signupPwdInput.type === 'password') {
      signupPwdInput.type = 'text';
      toggleSignupPwd.textContent = 'Hide';
    } else {
      signupPwdInput.type = 'password';
      toggleSignupPwd.textContent = 'Show';
    }
  });

  // Password strength dynamic bar
  signupPwdInput?.addEventListener('input', (e) => {
    const val = e.target.value;
    const bar = container.querySelector('#pwd-strength-bar');
    if (!bar) return;
    if (val.length === 0) {
      bar.style.width = '0%';
    } else if (val.length < 6) {
      bar.style.width = '30%';
      bar.className = 'h-full bg-rose-500 transition-all duration-300';
    } else if (val.length < 10) {
      bar.style.width = '65%';
      bar.className = 'h-full bg-amber-500 transition-all duration-300';
    } else {
      bar.style.width = '100%';
      bar.className = 'h-full bg-emerald-500 transition-all duration-300';
    }
  });

  // Social Login buttons (Mock OAuth)
  btnGoogle?.addEventListener('click', () => {
    store.updateProfile({
      name: 'Google Athlete',
      email: 'user@gmail.com',
      isLoggedIn: true,
      hasCompletedQuiz: true
    });
    store.setAuthMode('app');
    store.setTab('home');
  });

  btnApple?.addEventListener('click', () => {
    store.updateProfile({
      name: 'Apple Athlete',
      email: 'athlete@icloud.com',
      isLoggedIn: true,
      hasCompletedQuiz: true
    });
    store.setAuthMode('app');
    store.setTab('home');
  });

  // Quick Demo Login
  btnQuickDemo?.addEventListener('click', () => {
    store.loginAsGuest();
  });

  // Login Submit
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = container.querySelector('#login-email').value;
    store.updateProfile({
      email,
      isLoggedIn: true,
      hasCompletedQuiz: true
    });
    store.setAuthMode('app');
    store.setTab('home');
  });

  // Sign Up Submit -> Takes user to Onboarding Personalization Quiz
  signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = container.querySelector('#signup-name').value;
    const email = container.querySelector('#signup-email').value;
    const phone = container.querySelector('#signup-phone').value;

    store.updateProfile({
      name,
      email,
      phone,
      isLoggedIn: true,
      hasCompletedQuiz: false
    });
    store.setAuthMode('quiz');
  });

  // Forgot password modal
  btnForgot?.addEventListener('click', () => {
    forgotModal?.classList.remove('hidden');
  });

  closeForgotModal?.addEventListener('click', () => {
    forgotModal?.classList.add('hidden');
  });

  forgotForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const successBox = container.querySelector('#forgot-success');
    successBox?.classList.remove('hidden');
    setTimeout(() => {
      forgotModal?.classList.add('hidden');
      successBox?.classList.add('hidden');
    }, 2000);
  });
}
