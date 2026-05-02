// =============================================
// EMOBILITY SYSTEM LAB – MAIN JS (FINAL CLEAN)
// =============================================

// Navbar scroll effect
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
}

// =============================================
// CONTACT FORM
// =============================================
async function handleContactForm(e) {
  e.preventDefault();

  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');

  const name = form.querySelector('#name')?.value;
  const email = form.querySelector('#email')?.value;
  const subject = form.querySelector('#subject')?.value || "";
  const message = form.querySelector('#message')?.value;

  btn.disabled = true;
  btn.innerHTML = 'Sending...';

  try {
    const res = await fetch('/api/forms/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });

    if (res.ok) {
      btn.innerHTML = 'Message Sent ✔';
      form.reset();
    } else {
      btn.innerHTML = 'Error ❌';
    }
  } catch (err) {
    console.error(err);
    btn.innerHTML = 'Error ❌';
  }

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = 'Send Message';
  }, 2500);
}

// =============================================
// HIRING FORM
// =============================================
async function handleHiringForm(e) {
  e.preventDefault();

  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');

  const data = {
    name: form.querySelector('#name')?.value,
    email: form.querySelector('#email')?.value,
    phone: form.querySelector('#phone')?.value,
    expertise: form.querySelector('#expertise')?.value,
    linkedin: form.querySelector('#linkedin')?.value,
    experience: form.querySelector('#experience')?.value,
  };

  btn.disabled = true;
  btn.innerHTML = 'Submitting...';

  try {
    const res = await fetch('/api/forms/hiring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      btn.innerHTML = 'Submitted ✔';
      form.reset();
    } else {
      btn.innerHTML = 'Error ❌';
    }
  } catch (err) {
    console.error(err);
    btn.innerHTML = 'Error ❌';
  }

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = 'Submit Application';
  }, 2500);
}

// =============================================
// AUTH TABS
// =============================================
function initAuthTabs() {
  const tabs = document.querySelectorAll('.auth-tab');
  const panels = document.querySelectorAll('.auth-form-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(tab.dataset.target)?.classList.add('active');
    });
  });
}

// =============================================
// LOGIN / SIGNUP
// =============================================
function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = loginForm.querySelector('#login-email').value;
      const password = loginForm.querySelector('#login-password').value;
      const btn = loginForm.querySelector('button');

      btn.disabled = true;
      btn.innerHTML = 'Logging in...';

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data));
          window.location.href = 'index.html';
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error(err);
      }

      btn.disabled = false;
      btn.innerHTML = 'Sign In';
    });
  }

  // SIGNUP
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        firstName: signupForm.querySelector('#first-name').value,
        lastName: signupForm.querySelector('#last-name').value,
        email: signupForm.querySelector('#signup-email').value,
        phone: signupForm.querySelector('#phone').value,
        courseInterest: signupForm.querySelector('#course-interest').value,
        password: signupForm.querySelector('#signup-password').value,
      };

      const btn = signupForm.querySelector('button');
      btn.disabled = true;
      btn.innerHTML = 'Creating...';

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
          localStorage.setItem('token', result.token);
          window.location.href = 'index.html';
        } else {
          alert(result.message);
        }
      } catch (err) {
        console.error(err);
      }

      btn.disabled = false;
      btn.innerHTML = 'Create Account';
    });
  }
}

// =============================================
// AUTH STATUS
// =============================================
function checkAuthStatus() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const nav = document.querySelector('.nav-actions');

  if (user && nav) {
    nav.innerHTML = `
      <span>Hi, ${user.firstName}</span>
      <button id="logoutBtn">Logout</button>
    `;

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      localStorage.clear();
      location.reload();
    });
  }
}

// =============================================
// RAZORPAY PAYMENT
// =============================================
async function initiateRazorpayPayment(courseId, amount) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return alert("Login required");

  const res = await fetch('/api/payments/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      courseId,
      amount: Number(amount),
      userId: user._id
    })
  });

  const data = await res.json();

  const options = {
    key: "rzp_test_SZ453oY9bSiNAY",
    amount: data.amount,
    currency: "INR",
    order_id: data.orderId,
    name: "Emobility System Lab",
    handler: async function (response) {
      await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response)
      });

      alert("Payment Successful!");
      location.reload();
    },
    prefill: {
      name: user.firstName,
      email: user.email,
      contact: user.phone
    }
  };

  new Razorpay(options).open();
}

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initAuthTabs();
  initLoginForm();
  checkAuthStatus();
});
