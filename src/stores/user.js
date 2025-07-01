import { writable } from 'svelte/store';

export const currentUser = writable(null);
export const isAuthenticated = writable(false);

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('currentUser');
  if (stored) {
    const parsed = JSON.parse(stored);
    currentUser.set(parsed);
    isAuthenticated.set(true);
  }

  currentUser.subscribe(value => {
    if (value) {
      localStorage.setItem('currentUser', JSON.stringify(value));
      isAuthenticated.set(true);
    } else {
      localStorage.removeItem('currentUser');
      isAuthenticated.set(false);
    }
  });
}