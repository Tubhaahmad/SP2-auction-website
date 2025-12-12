import { loadNavbar } from '../src/navbar.mjs';
import { loadFooter } from '../src/footer.mjs';

import '../src/scss/styles.scss';

loadNavbar();
loadFooter();
console.log('Login page is working!!!!!!');

const form = document.getElementById('login-form');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  const loginInfo = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch('https://v2.api.noroff.dev/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginInfo),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('Login error:', data);
      alert('Login failed. Please check your email and password!');
      return;
    }

    // 🔑 Store login information in a simple way
    localStorage.setItem('token', data.data.accessToken);
    localStorage.setItem('username', data.data.name);
    localStorage.setItem('user', JSON.stringify(data.data));

    alert('You are logged in!');

    window.location.href = '/index.html';
  } catch (error) {
    console.log('Something went wrong:', error);
    alert('Something went wrong. Try again later.');
  }
});
