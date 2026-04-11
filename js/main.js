// =============================================
// EMOBILITY SYSTEM LAB – MAIN JS
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

// Contact form handler
async function handleContactForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject')?.value;
  const message = document.getElementById('message').value;

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  try {
    const res = await fetch('/api/forms/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });

    if (res.ok) {
      btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
      btn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
      e.target.reset();
    } else {
      btn.innerHTML = 'Error Sending <i class="fas fa-times"></i>';
      btn.style.background = 'red';
    }
  } catch (error) {
    console.error(error);
    btn.innerHTML = 'Error Sending <i class="fas fa-times"></i>';
    btn.style.background = 'red';
  }

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
    btn.style.background = '';
  }, 3000);
}

// Teacher Hiring form handler
async function handleHiringForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const expertise = document.getElementById('expertise').value;
  const linkedin = document.getElementById('linkedin').value;
  const experience = document.getElementById('experience').value;

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

  try {
    const res = await fetch('/api/forms/hiring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, expertise, linkedin, experience })
    });

    if (res.ok) {
      btn.innerHTML = 'Application Submitted! <i class="fas fa-check"></i>';
      btn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
      e.target.reset();
    } else {
      btn.innerHTML = 'Error Submitting <i class="fas fa-times"></i>';
      btn.style.background = 'red';
    }
  } catch (error) {
    console.error(error);
    btn.innerHTML = 'Error Submitting <i class="fas fa-times"></i>';
    btn.style.background = 'red';
  }

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = 'Submit Application <i class="fas fa-paper-plane"></i>';
    btn.style.background = '';
  }, 3000);
}


// Auth tabs
function initAuthTabs() {
  const tabs = document.querySelectorAll('.auth-tab');
  const panels = document.querySelectorAll('.auth-form-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
    });
  });
  // Check if URL has #signup hash
  if (window.location.hash === '#signup') {
    const signupTab = document.querySelector('[data-target="signup-panel"]');
    if (signupTab) signupTab.click();
  }
}

// Course accordion/tabs
function initCourseTabs() {
  const tabBtns = document.querySelectorAll('.course-tab-btn');
  const tabPanels = document.querySelectorAll('.course-tab-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(btn.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });
}

// Curriculum accordion
function initCurriculum() {
  const headers = document.querySelectorAll('.module-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const lessons = header.nextElementSibling;
      const icon = header.querySelector('.acc-icon');
      lessons.classList.toggle('open');
      if (icon) icon.style.transform = lessons.classList.contains('open') ? 'rotate(180deg)' : '';
    });
  });
  // Open first module by default
  const firstLessons = document.querySelector('.module-lessons');
  if (firstLessons) firstLessons.classList.add('open');
}

// Scroll reveal animation
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  const animatable = document.querySelectorAll('.feature-card, .course-card, .testimonial-card, .about-stat-card');
  animatable.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
    observer.observe(el);
  });
}

// Auth login form
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

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
          alert('Login failed: ' + data.message);
          btn.disabled = false;
          btn.innerHTML = 'Sign In <i class="fas fa-arrow-right"></i>';
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again later.');
        btn.disabled = false;
        btn.innerHTML = 'Sign In <i class="fas fa-arrow-right"></i>';
      }
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = signupForm.querySelector('button[type="submit"]');
      const firstName = document.getElementById('first-name').value;
      const lastName = document.getElementById('last-name').value;
      const email = document.getElementById('signup-email').value;
      const phone = document.getElementById('phone').value;
      const courseInterest = document.getElementById('course-interest').value;
      const password = document.getElementById('signup-password').value;

      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName, email, phone, courseInterest, password })
        });
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data));
          btn.innerHTML = 'Account Created! <i class="fas fa-check"></i>';
          btn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        } else {
          alert('Signup failed: ' + data.message);
          btn.disabled = false;
          btn.innerHTML = 'Create Account <i class="fas fa-arrow-right"></i>';
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again later.');
        btn.disabled = false;
        btn.innerHTML = 'Create Account <i class="fas fa-arrow-right"></i>';
      }
    });
  }
}

// Check auth status
function checkAuthStatus() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      const navActions = document.querySelector('.nav-actions');
      if (navActions) {
        navActions.innerHTML = `
          <span style="color:white; margin-right: 15px;">Welcome, ${user.firstName}</span>
          <a href="#" id="logoutBtn" class="btn-outline">Logout</a>
        `;
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.reload();
        });
      }
    } catch (err) {
      console.error('Error parsing user data', err);
    }
  }
}

// Razorpay Payment Handler
async function initiateRazorpayPayment(courseId, amount) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    alert("Please login first to enroll in this course.");
    window.location.href = 'login.html#signup';
    return;
  }

  const user = JSON.parse(userStr);

  try {
    // 1. Create Order on backend
    const res = await fetch('/api/payments/create-order', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount, courseId: courseId, userId: user._id }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    // 2. Open Razorpay Checkout
    const options = {
      key: "rzp_test_SZ453oY9bSiNAY", // This should be your public Key ID
      amount: data.amount,
      currency: data.currency,
      name: "Emobility System Lab",
      description: `Course: ${courseId}`,
      order_id: data.orderId,
      handler: async function (response) {
        // 3. Verify Payment on backend
        const verifyRes = await fetch('/api/payments/verify', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok) {
          alert("Success! You are now enrolled in the course.");
          window.location.reload();
        } else {
          alert("Payment verification failed: " + verifyData.message);
        }
      },
      prefill: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        contact: user.phone || ""
      },
      theme: { color: "#0f766e" },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Payment error:", error);
    alert("Error starting payment process. Please check your credentials.");
  }
}

function handleEnrollmentClick() {
  const enrollBtns = document.querySelectorAll('.btn-enroll-now');
  enrollBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const courseId = btn.dataset.courseId || "unknown";
      const amount = btn.dataset.price || 5999;
      initiateRazorpayPayment(courseId, amount);
    });
  });
}


// Courses page filter
function initCoursesFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('[data-category]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      courseCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Active nav link
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === currentPage || (currentPage === '' && href === 'index.html'));
  });
}

// =============================================
// COURSE CONTENT & PROGRESS TRACKING
// =============================================

const COURSE_CONTENT_DATA = {
  'gen-ai': {
    videos: [
      { id: 'v1', title: 'Introduction to GenAI', duration: '12:05', url: 'https://www.youtube.com/embed/gcS0yY7jcaE' },
      { id: 'v2', title: 'LLM Architectures', duration: '18:30', url: 'https://www.youtube.com/embed/5sLYAQS9s90' },
      { id: 'v3', title: 'Prompt Engineering Basics', duration: '15:20', url: 'https://www.youtube.com/embed/jC4v5AS4RIM' }
    ],
    assignments: [
      { id: 'a1', title: 'Build a Zero-shot Prompt', file: '#', type: 'PDF' },
      { id: 'a2', title: 'LangChain Integration Task', file: '#', type: 'ZIP' }
    ],
    notes: [
      { title: 'GenAI Roadmap 2025', img: 'assets/c-notes.png' },
      { title: 'Prompt Engineering Cheat Sheet', img: 'assets/c-notes.png' }
    ]
  },
  'c-lang': {
    videos: [
      { id: 'c1', title: 'C Fundamentals', duration: '10:00', url: 'https://www.youtube.com/embed/KJgsSFOSQv0' },
      { id: 'c2', title: 'Pointers & Memory', duration: '22:15', url: 'https://www.youtube.com/embed/2ybLD6_2gKM' }
    ],
    assignments: [
      { id: 'ca1', title: 'Memory Management Lab', file: '#', type: 'PDF' }
    ],
    notes: [
      { title: 'C Programming Master Notes', img: 'assets/c-notes.png' },
      { title: 'Pointer Visualization Diagram', img: 'assets/c-notes.png' }
    ]
  },
  'python': {
    videos: [
      { id: 'p1', title: 'Python Basics', duration: '15:00', url: 'https://www.youtube.com/embed/rfscVS0vtbw' }
    ],
    assignments: [
      { id: 'pa1', title: 'Data Analysis Project', file: '#', type: 'ZIP' }
    ],
    notes: [
      { title: 'Python Syntax Guide', img: 'assets/c-notes.png' }
    ]
  }
};

function getEnrolledCourses() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return [];
  try {
    const user = JSON.parse(userStr);
    // For demo/test: if user is logged in, they are considered enrolled
    return ['c-lang', 'gen-ai', 'python', 'embedded', 'csms'];
  } catch(e) { return []; }
}

function initCourseContent() {
  const container = document.querySelector('.course-body-section');
  if (!container) return;

  const enrollBtn = document.querySelector('.btn-enroll-now');
  const courseId = enrollBtn ? (enrollBtn.dataset.courseId || 'gen-ai') : 'gen-ai';
  const enrolled = getEnrolledCourses().includes(courseId);

  // Initial Renders
  renderLectures(courseId, enrolled);
  renderAssignments(courseId, enrolled);
  renderNotes(courseId, enrolled);
  renderDashboard(courseId, enrolled);
  renderTests(courseId, enrolled);
}

function renderLectures(courseId, enrolled) {
  const panel = document.getElementById('lectures-tab');
  if (!panel) return;

  if (!enrolled) {
    panel.innerHTML = `
      <div class="locked-content">
        <div class="locked-overlay">
          <i class="fas fa-lock"></i>
          <h3>Course Content Locked</h3>
          <p>Please enroll in this course to access HD video lectures, project files, and mentor support.</p>
          <a href="#" class="btn-primary btn-enroll-now" data-course-id="${courseId}">Enroll Now to Unlock</a>
        </div>
      </div>
    `;
    panel.querySelector('.btn-enroll-now').addEventListener('click', (e) => {
      e.preventDefault();
      initiateRazorpayPayment(courseId, 5999);
    });
    return;
  }

  const data = COURSE_CONTENT_DATA[courseId] || { videos: [] };
  const firstVideo = data.videos[0] || { url: '', title: 'No Video' };

  panel.innerHTML = `
    <div class="lectures-container">
      <div class="video-player-wrap">
        <iframe id="mainVideoPlayer" src="${firstVideo.url}" frameborder="0" allowfullscreen></iframe>
      </div>
      <div class="video-playlist">
        <div class="playlist-header">Course Playlist (${data.videos.length} Lessons)</div>
        <div class="playlist-items">
          ${data.videos.map((v, i) => `
            <div class="playlist-item ${i === 0 ? 'active' : ''}" data-url="${v.url}" data-id="${v.id}">
              <i class="fas ${isLessonComplete(v.id) ? 'fa-check-circle' : 'fa-play-circle'}"></i>
              <div style="flex:1;">
                <div>${v.title}</div>
                <small style="color:var(--gray);">${v.duration}</small>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  panel.querySelectorAll('.playlist-item').forEach(item => {
    item.addEventListener('click', () => {
      panel.querySelectorAll('.playlist-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      document.getElementById('mainVideoPlayer').src = item.dataset.url;
      markLessonComplete(item.dataset.id);
      item.querySelector('i').className = 'fas fa-check-circle';
      updateDashboard(courseId, true);
    });
  });
}

function renderAssignments(courseId, enrolled) {
  const panel = document.getElementById('assignments-tab');
  if (!panel) return;

  const data = COURSE_CONTENT_DATA[courseId] || { assignments: [] };
  panel.innerHTML = `
    <h3 style="margin-bottom:20px;">Course Assignments</h3>
    <div class="assignments-grid">
      ${data.assignments.map(a => `
        <div class="assignment-card">
          <div class="assignment-meta"><span>PROJECT</span> <span>${a.type}</span></div>
          <h4>${a.title}</h4>
          <p>Complete this task to test your knowledge. Submit the code in ${a.type} format.</p>
          <a href="${a.file}" class="btn-outline" style="padding:8px 16px; font-size:12px; border-radius:8px;">Download Material</a>
        </div>
      `).join('')}
      ${data.assignments.length === 0 ? '<p>No assignments uploaded yet.</p>' : ''}
    </div>
  `;
}

function renderNotes(courseId, enrolled) {
  const panel = document.getElementById('notes-tab');
  if (!panel) return;

  const data = COURSE_CONTENT_DATA[courseId] || { notes: [] };
  panel.innerHTML = `
    <h3 style="margin-bottom:20px;">Study Materials & Notes</h3>
    <div class="notes-container">
      ${data.notes.map(n => `
        <div class="note-item">
          <img src="${n.img}" alt="${n.title}" class="note-img">
          <div class="note-content">
            <h4>${n.title}</h4>
            <a href="${n.img}" target="_blank" class="btn-outline" style="padding:6px 12px; font-size:11px;">View Full Image</a>
          </div>
        </div>
      `).join('')}
      ${data.notes.length === 0 ? '<p>No notes available for this course.</p>' : ''}
    </div>
  `;
}

function renderTests(courseId, enrolled) {
  const panel = document.getElementById('tests-tab');
  if (!panel) return;

  panel.innerHTML = `
    <div class="quiz-container">
      <div style="text-align:center; margin-bottom:32px;">
        <i class="fas fa-file-signature" style="font-size:3rem; color:var(--primary); margin-bottom:16px;"></i>
        <h3>Course Proficiency Test</h3>
        <p>Complete this test to unlock your industry certification.</p>
      </div>
      <div class="quiz-question">
        <h4>1. Which of the following is a primary characteristic of this domain?</h4>
        <div class="quiz-options">
          <div class="quiz-option">Option A: Detailed Implementation</div>
          <div class="quiz-option">Option B: Abstract Concept</div>
          <div class="quiz-option">Option C: Performance Optimization</div>
          <div class="quiz-option">Option D: All of the above</div>
        </div>
      </div>
      <button class="btn-primary" style="width:100%;">Submit Test</button>
    </div>
  `;

  panel.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => {
      panel.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
}

function renderDashboard(courseId, enrolled) {
  const panel = document.getElementById('dashboard-tab');
  if (!panel) return;

  const data = COURSE_CONTENT_DATA[courseId] || { videos: [] };
  const total = data.videos.length || 1;
  const completedCount = data.videos.filter(v => isLessonComplete(v.id)).length;
  const percent = Math.round((completedCount / total) * 100);
  const offset = 440 - (440 * percent) / 100;

  panel.innerHTML = `
    <div class="dashboard-grid">
      <div class="progress-card">
        <h4>Overall Completion</h4>
        <div class="progress-circle-wrap">
          <svg><circle class="circle-bg" cx="75" cy="75" r="70"></circle><circle class="circle-val" cx="75" cy="75" r="70" style="stroke-dashoffset: ${offset}"></circle></svg>
          <div class="progress-percent">${percent}%</div>
        </div>
        <p style="color:var(--gray); font-size:14px;">You have completed <strong>${completedCount}</strong> out of <strong>${total}</strong> lessons.</p>
      </div>
      <div class="stats-card">
        <div class="stat-box"><i class="fas fa-clock" style="color:var(--primary); font-size:24px;"></i><div style="font-size:20px; font-weight:800;">${data.videos.length * 15}m</div><small>Time Spent</small></div>
        <div class="stat-box"><i class="fas fa-tasks" style="color:var(--orange); font-size:24px;"></i><div style="font-size:20px; font-weight:800;">${completedCount}</div><small>Lessons Done</small></div>
        <div class="stat-box"><i class="fas fa-award" style="color:var(--accent); font-size:24px;"></i><div style="font-size:20px; font-weight:800;">0</div><small>Certificates</small></div>
        <div class="stat-box"><i class="fas fa-star" style="color:var(--purple); font-size:24px;"></i><div style="font-size:20px; font-weight:800;">4.9</div><small>Rating</small></div>
      </div>
    </div>
  `;
}

function updateDashboard(courseId, enrolled) {
  renderDashboard(courseId, enrolled);
}

function isLessonComplete(lessonId) {
  const completed = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
  return completed.includes(lessonId);
}

function markLessonComplete(lessonId) {
  const completed = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    localStorage.setItem('completed_lessons', JSON.stringify(completed));
  }
}

// Init All
document.addEventListener('DOMContentLoaded', () => {
  initAuthTabs();
  initCourseTabs();
  initCurriculum();
  initScrollReveal();
  initLoginForm();
  initCoursesFilter();
  setActiveNavLink();
  checkAuthStatus();
  handleEnrollmentClick();
  initCourseContent();
});
