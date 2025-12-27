import { supabase } from '../lib/supabase';

const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
const userNameElement = document.getElementById('userName') as HTMLSpanElement;
const userEmailElement = document.getElementById('userEmail') as HTMLSpanElement;

async function loadUserData() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      window.location.href = '/auth.html';
      return;
    }

    const user = data.session.user;
    const username = user.user_metadata?.username || localStorage.getItem('username');

    if (username) {
      userNameElement.textContent = username;
    } else if (user.email) {
      userNameElement.textContent = user.email.split('@')[0];
    }

    if (user.email) {
      userEmailElement.textContent = user.email;
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    window.location.href = '/auth.html';
  }
}

logoutBtn?.addEventListener('click', async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    localStorage.removeItem('username');
    window.location.href = '/auth.html';
  } catch (error) {
    console.error('Error signing out:', error);
    alert('An error occurred while signing out. Please try again.');
  }
});

supabase.auth.onAuthStateChange((event) => {
  (async () => {
    if (event === 'SIGNED_OUT') {
      window.location.href = '/auth.html';
    } else if (event === 'SIGNED_IN') {
      await loadUserData();
    }
  })();
});

loadUserData();
