/**
 * Gramya – Indian Village Website
 * Main JavaScript: Navigation, Scroll Effects, Gallery Filter, Video Control
 */

/* ============================================================
   0. ENTRANCE OVERLAY
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('entranceOverlay');
  if (overlay) {
    // Prevent scrolling while overlay is visible
    document.body.style.overflow = 'hidden';

    // The CSS animation takes 2.5s. We wait 2.8s to allow fade-out effect.
    setTimeout(() => {
      overlay.classList.add('fade-out');
      document.body.style.overflow = '';

      // Remove entirely from DOM after transition
      setTimeout(() => {
        overlay.remove();
      }, 800);
    }, 2800);
  }
});

/* ============================================================
   1. NAVBAR – Transparent → Solid on scroll
============================================================ */
const navbar = document.getElementById('navbar');

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.remove('nav-transparent');
    navbar.classList.add('nav-solid');
  } else {
    navbar.classList.remove('nav-solid');
    navbar.classList.add('nav-transparent');
  }
}

// Initialize on page load
updateNavbar();
window.addEventListener('scroll', updateNavbar, { passive: true });

/* ============================================================
   2. MOBILE NAV TOGGLE
============================================================ */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   3. ACTIVE NAV LINK – Highlight current section on scroll
============================================================ */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(link => link.classList.remove('active'));
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  },
  { threshold: 0.35 }
);
sections.forEach(sec => sectionObserver.observe(sec));

/* ============================================================
   4. SCROLL REVEAL ANIMATION
   Elements with class .reveal fade in when they enter viewport
============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once revealed, stop observing to save resources
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   5. HERO VIDEO – Pause / Play BUTTON
============================================================ */
const heroBgVideo = document.getElementById('heroBgVideo');
const videoControl = document.getElementById('videoControl');
const iconPause = videoControl?.querySelector('.icon-pause');
const iconPlay = videoControl?.querySelector('.icon-play');

if (heroBgVideo && videoControl) {
  videoControl.addEventListener('click', () => {
    if (heroBgVideo.paused) {
      heroBgVideo.play();
      iconPause.style.display = '';
      iconPlay.style.display = 'none';
      videoControl.setAttribute('aria-label', 'Pause video');
    } else {
      heroBgVideo.pause();
      iconPause.style.display = 'none';
      iconPlay.style.display = '';
      videoControl.setAttribute('aria-label', 'Play video');
    }
  });

  // If video can't autoplay (no video src), hide the control button
  heroBgVideo.addEventListener('error', () => {
    if (videoControl) videoControl.style.display = 'none';
  });
}

/* ============================================================
   6. GALLERY FILTER – Filter by category
============================================================ */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const category = item.dataset.category;
      const isVisible = filter === 'all' || category === filter;

      if (isVisible) {
        item.style.display = '';
        // Small delay for re-trigger of animation
        requestAnimationFrame(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        });
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (btn.dataset.filter !== 'all' && item.dataset.category !== btn.dataset.filter) {
            item.style.display = 'none';
          }
        }, 300);
      }
    });
  });
});

/* ============================================================
   7. SMOOTH SCROLL – Polyfill for older browsers
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetSelector = anchor.getAttribute('href');
    if (targetSelector === '#') return;

    const target = document.querySelector(targetSelector);
    if (!target) return;

    e.preventDefault();
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   8. COUNTER ANIMATION – Animate stat numbers on scroll
============================================================ */
function animateCounter(el, target) {
  let current = 0;
  const increment = target / 60; // ~60 frames
  const isDecimaled = String(target).includes('.');
  const suffix = el.dataset.suffix || '';

  const update = () => {
    current += increment;
    if (current >= target) {
      el.textContent = (isDecimaled ? target.toFixed(1) : Math.floor(target)) + suffix;
      return;
    }
    el.textContent = (isDecimaled ? current.toFixed(1) : Math.floor(current)) + suffix;
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Extract numeric value from text (e.g. "2,000" → 2000, "12+" → 12)
        const rawText = el.textContent.replace(/,/g, '').replace('+', '').trim();
        const target = parseFloat(rawText);
        if (!isNaN(target)) animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach(el => counterObserver.observe(el));

/* ============================================================
   9. LIKE & COMMENT SYSTEM
   - Likes and comments are stored in localStorage per media ID
   - Comment modal is a shared singleton
============================================================ */

// ---- Data store helpers ----
const STORE_KEY = 'panangadu_media';

function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch { return {}; }
}

function saveStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function getMediaData(id) {
  const store = loadStore();
  if (!store[id]) store[id] = { liked: false, likes: 0, comments: [] };
  return store[id];
}

function setMediaData(id, data) {
  const store = loadStore();
  store[id] = data;
  saveStore(store);
}

// ---- Initialise all buttons with saved counts ----
function initMediaButtons() {
  document.querySelectorAll('.like-btn').forEach(btn => {
    const id = btn.dataset.media;
    const data = getMediaData(id);
    btn.querySelector('.like-count').textContent = data.likes;
    if (data.liked) btn.classList.add('liked');
  });

  document.querySelectorAll('.comment-btn').forEach(btn => {
    const id = btn.dataset.media;
    const data = getMediaData(id);
    btn.querySelector('.comment-count').textContent = data.comments.length;
  });
}

initMediaButtons();

// ---- Like button clicks ----
document.addEventListener('click', e => {
  const btn = e.target.closest('.like-btn');
  if (!btn) return;
  const id = btn.dataset.media;
  const data = getMediaData(id);

  if (data.liked) {
    data.liked = false;
    data.likes = Math.max(0, data.likes - 1);
    btn.classList.remove('liked');
  } else {
    data.liked = true;
    data.likes += 1;
    btn.classList.add('liked');
  }

  setMediaData(id, data);

  // Update all like-count spans for this media (in case duplicates)
  document.querySelectorAll(`.like-btn[data-media="${id}"] .like-count`).forEach(el => {
    el.textContent = data.likes;
  });
});

// ---- Comment Modal ----
const commentModal = document.getElementById('commentModal');
const commentModalClose = document.getElementById('commentModalClose');
const commentModalSubtitle = document.getElementById('commentModalSubtitle');
const commentList = document.getElementById('commentList');
const commentNameInput = document.getElementById('commentNameInput');
const commentTextInput = document.getElementById('commentTextInput');
const commentSubmitBtn = document.getElementById('commentSubmitBtn');

let activeMediaId = null;

function openCommentModal(id, title) {
  activeMediaId = id;
  commentModalSubtitle.textContent = title ? `📸 ${title}` : '';
  renderComments(id);
  commentModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Focus the textarea after animation
  setTimeout(() => commentTextInput.focus(), 350);
}

function closeCommentModal() {
  commentModal.classList.remove('open');
  document.body.style.overflow = '';
  activeMediaId = null;
}

function renderComments(id) {
  const data = getMediaData(id);
  commentList.innerHTML = '';
  data.comments.forEach(c => {
    const bubble = document.createElement('div');
    bubble.className = 'comment-bubble';
    bubble.innerHTML = `
      <div class="comment-bubble-name">${escapeHtml(c.name || 'Anonymous')}</div>
      <div class="comment-bubble-text">${escapeHtml(c.text)}</div>
      <div class="comment-bubble-time">${c.time}</div>
    `;
    commentList.appendChild(bubble);
  });
  // Scroll to bottom
  commentList.scrollTop = commentList.scrollHeight;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatTime() {
  const now = new Date();
  return now.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// Open on comment-btn click
document.addEventListener('click', e => {
  const btn = e.target.closest('.comment-btn');
  if (!btn) return;
  openCommentModal(btn.dataset.media, btn.dataset.title);
});

// Close on X / backdrop
commentModalClose?.addEventListener('click', closeCommentModal);
commentModal?.querySelector('.comment-modal-backdrop')?.addEventListener('click', closeCommentModal);

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && commentModal?.classList.contains('open')) closeCommentModal();
});

// Submit comment
function submitComment() {
  const text = commentTextInput.value.trim();
  if (!text || !activeMediaId) return;

  const name = commentNameInput.value.trim() || 'Anonymous';
  const data = getMediaData(activeMediaId);
  data.comments.push({ name, text, time: formatTime() });
  setMediaData(activeMediaId, data);

  renderComments(activeMediaId);
  commentTextInput.value = '';

  // Update comment counts on all matching buttons
  const count = data.comments.length;
  document.querySelectorAll(`.comment-btn[data-media="${activeMediaId}"] .comment-count`).forEach(el => {
    el.textContent = count;
  });
}

commentSubmitBtn?.addEventListener('click', submitComment);
commentTextInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment(); }
});

/* ============================================================
   10. LIGHTBOX GALLERY
============================================================ */
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

// Open Lightbox when an image (not action button) is clicked
document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', (e) => {
    e.stopPropagation();
    const src = img.getAttribute('src');
    const captionText = img.closest('.gallery-item').querySelector('.gallery-info h3').textContent;

    lightboxImg.setAttribute('src', src);
    lightboxCaption.textContent = captionText;

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  });
});

function closeLightbox() {
  lightboxModal.classList.remove('active');
  lightboxModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightboxModal?.addEventListener('click', (e) => {
  if (e.target === lightboxModal) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightboxModal?.classList.contains('active')) closeLightbox();
});

/* ============================================================
   11. BACK TO TOP BUTTON
============================================================ */
const backToTopBtn = document.getElementById('backToTopBtn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
}, { passive: true });

backToTopBtn?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

/* ============================================================
   12. FEEDBACK SYSTEM (LOCAL STORAGE)
============================================================ */
const feedbackForm = document.getElementById('villageFeedbackForm');
const feedbackListEl = document.getElementById('villageFeedbackList');

function loadFeedbacks() {
  const stored = localStorage.getItem('panangadu_feedbacks');
  if (stored) {
    return JSON.parse(stored);
  }
  return [
    { name: 'Karthik', message: 'The entrance animation is beautiful! Looking forward to the next festival.', time: '2025-01-15 10:30' },
    { name: 'Meena', message: 'I love seeing all the photos of our village. Very well organized website.', time: '2025-01-10 14:15' }
  ];
}

function saveFeedback(feedbackObj) {
  const feedbacks = loadFeedbacks();
  feedbacks.unshift(feedbackObj); // Add to top
  localStorage.setItem('panangadu_feedbacks', JSON.stringify(feedbacks));
}

function renderFeedbacks() {
  if (!feedbackListEl) return;
  const feedbacks = loadFeedbacks();
  if (feedbacks.length === 0) {
    feedbackListEl.innerHTML = '<p style="color:var(--color-text-muted);">No feedback yet. Be the first!</p>';
    return;
  }

  feedbackListEl.innerHTML = feedbacks.map(fb => `
    <div class="feedback-card">
      <h4>${fb.name}</h4>
      <p>${fb.message}</p>
      <small>${fb.time}</small>
    </div>
  `).join('');
}

// Initial render
renderFeedbacks();

if (feedbackForm) {
  feedbackForm.addEventListener('submit', (e) => {
    // We let the form submit naturally to trigger "mailto:"
    // But right before that, we save to local storage:
    const nameInput = document.getElementById('fbName').value.trim();
    const messageInput = document.getElementById('fbMessage').value.trim();

    if (nameInput && messageInput) {
      saveFeedback({
        name: nameInput,
        message: messageInput,
        time: new Date().toLocaleString()
      });

      // Update the UI immediately
      renderFeedbacks();

      // Clear the inputs slightly after so mailto still grabs them
      setTimeout(() => {
        document.getElementById('fbName').value = '';
        document.getElementById('fbMessage').value = '';
        alert("Feedback saved securely! Your email app will now open to send to panangadu2025@gmail.com.");
      }, 500);
    }
  });
}




// Reveal animation on scroll
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  reveals.forEach((el) => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) {
      el.classList.add("active");
    }
  });
});
/* ==========================================================
  ❤️ LIKE + DOUBLE CLICK FUNCTION
========================================================== */

// Toggle like on button click
document.querySelectorAll(".like-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("liked");
  });
});

// Double click like on gallery image
document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("dblclick", () => {

    // Create heart
    const heart = document.createElement("div");
    heart.classList.add("double-heart");
    heart.innerHTML = "❤";

    item.appendChild(heart);

    setTimeout(() => {
      heart.classList.add("show");
    }, 10);

    // Remove heart after animation
    setTimeout(() => {
      heart.remove();
    }, 800);

    // Auto like button
    const likeBtn = item.querySelector(".like-btn");
    if (likeBtn && !likeBtn.classList.contains("liked")) {
      likeBtn.classList.add("liked");
    }
  });
});

// Like button click
document.querySelectorAll(".like-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("liked");

    const parent = btn.closest(".gallery-item");
    if (parent) {
      parent.classList.toggle("liked");
    }
  });
});