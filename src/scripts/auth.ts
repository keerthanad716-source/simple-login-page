import { supabase } from '../lib/supabase';

const loginForm = document.getElementById('loginForm') as HTMLDivElement;
const signupForm = document.getElementById('signupForm') as HTMLDivElement;
const showSignupLink = document.getElementById('showSignup') as HTMLAnchorElement;
const showLoginLink = document.getElementById('showLogin') as HTMLAnchorElement;

const loginEmail = document.getElementById('loginEmail') as HTMLInputElement;
const loginPassword = document.getElementById('loginPassword') as HTMLInputElement;
const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
const loginMessage = document.getElementById('loginMessage') as HTMLDivElement;

const signupUsername = document.getElementById('signupUsername') as HTMLInputElement;
const signupEmail = document.getElementById('signupEmail') as HTMLInputElement;
const signupPassword = document.getElementById('signupPassword') as HTMLInputElement;
const signupBtn = document.getElementById('signupBtn') as HTMLButtonElement;
const signupMessage = document.getElementById('signupMessage') as HTMLDivElement;

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showMessage(element: HTMLDivElement, message: string, type: 'error' | 'success') {
  element.textContent = message;
  element.className = `message ${type}`;
}

function clearMessage(element: HTMLDivElement) {
  element.textContent = '';
  element.className = 'message';
}

showSignupLink?.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm?.classList.remove('active');
  setTimeout(() => {
    signupForm?.classList.add('active');
  }, 100);
  clearMessage(loginMessage);
  clearMessage(signupMessage);
});

showLoginLink?.addEventListener('click', (e) => {
  e.preventDefault();
  signupForm?.classList.remove('active');
  setTimeout(() => {
    loginForm?.classList.add('active');
  }, 100);
  clearMessage(loginMessage);
  clearMessage(signupMessage);
});

loginBtn?.addEventListener('click', async (e) => {
  e.preventDefault();
  clearMessage(loginMessage);

  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    showMessage(loginMessage, 'Please fill in all fields', 'error');
    return;
  }

  if (!validateEmail(email)) {
    showMessage(loginMessage, 'Please enter a valid email address', 'error');
    return;
  }

  if (password.length < 6) {
    showMessage(loginMessage, 'Password must be at least 6 characters', 'error');
    return;
  }

  loginBtn.disabled = true;
  loginBtn.innerHTML = '<span>Logging in...</span>';

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      showMessage(loginMessage, 'Login successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1000);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
    showMessage(loginMessage, errorMessage, 'error');
    loginBtn.disabled = false;
    loginBtn.innerHTML = `
      <span>Login</span>
      <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    `;
  }
});

signupBtn?.addEventListener('click', async (e) => {
  e.preventDefault();
  clearMessage(signupMessage);

  const username = signupUsername.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value.trim();

  if (!username || !email || !password) {
    showMessage(signupMessage, 'Please fill in all fields', 'error');
    return;
  }

  if (!validateEmail(email)) {
    showMessage(signupMessage, 'Please enter a valid email address', 'error');
    return;
  }

  if (password.length < 6) {
    showMessage(signupMessage, 'Password must be at least 6 characters', 'error');
    return;
  }

  signupBtn.disabled = true;
  signupBtn.innerHTML = '<span>Creating account...</span>';

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      localStorage.setItem('username', username);
      showMessage(signupMessage, 'Account created successfully! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1000);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during signup';
    showMessage(signupMessage, errorMessage, 'error');
    signupBtn.disabled = false;
    signupBtn.innerHTML = `
      <span>Sign Up</span>
      <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    `;
  }
});

async function checkAuthStatus() {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    window.location.href = '/dashboard.html';
  }
}

checkAuthStatus();
