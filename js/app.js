
async function loadConfig(){
  const res = await fetch('./assets/data/site.config.json');
  const cfg = await res.json();
  // Hero
  document.querySelector('#name').textContent = cfg.name;
  document.querySelector('#role').textContent = cfg.role;
  
  const summaryEl = document.querySelector('#summary');
  if (Array.isArray(cfg.summary)) {
    summaryEl.innerHTML = `<ul>${cfg.summary.map(s => `<li>${s}</li>`).join('')}</ul>`;
  } else {
    summaryEl.textContent = cfg.summary;
  }
  // Handle resume links - create dropdown if multiple formats available
  let resumeLink = '';
  if (typeof cfg.links.resume === 'object' && cfg.links.resume.pdf && cfg.links.resume.docx) {
    resumeLink = `<div class="resume-dropdown">
      <button class="btn ghost resume-btn" onclick="toggleResumeDropdown()">Resume</button>
      <div class="resume-dropdown-content" id="resume-dropdown">
        <a href="${cfg.links.resume.pdf}" target="_blank" rel="noopener">PDF</a>
        <a href="${cfg.links.resume.docx}" target="_blank" rel="noopener">DOCX</a>
      </div>
    </div>`;
  } else {
    resumeLink = `<a class="btn ghost" href="${cfg.links.resume.pdf || cfg.links.resume}" target="_blank" rel="noopener">Resume</a>`;
  }
  
  document.querySelector('#hero-links').innerHTML = `
    <a class="btn ghost" href="#" onclick="openImageSlider(); return false;">Images</a>
    <a class="btn ghost" href="${cfg.links.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
    <a class="btn ghost" href="${cfg.links.github}" target="_blank" rel="noopener">GitHub</a>
    ${resumeLink}
  `;
  const tags = document.querySelector('#tags'); tags.innerHTML = '';
  cfg.keywords.forEach(k => { 
    const link = document.createElement('a'); 
    link.href = cfg.keywordLinks[k] || '#'; 
    link.target = '_blank'; 
    link.rel = 'noopener'; 
    link.className = 'tag'; 
    link.textContent = k; 
    tags.appendChild(link); 
  });
  // Projects
  const list = document.querySelector('#projects'); list.innerHTML = '';
  cfg.projects.forEach(p => {
    const el = document.createElement('article'); el.className = 'card';
    el.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="badges">${p.stack.map(s => `<span class="badge">${s}</span>`).join('')}</div>
      <div class="card-footer">
        ${p.links.demo ? `<a href="${p.links.demo}" target="_blank" rel="noopener" class="demo-link">Demo</a>` : ''}
        <a href="${p.links.repo}" target="_blank" rel="noopener" class="github-icon" aria-label="View ${p.title} source code on GitHub">
          <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </a>
      </div>`;
    list.appendChild(el);
  });
  // Experience
  const exp = document.querySelector('#experience'); exp.innerHTML = '';
  cfg.experience.forEach(e => {
    const el = document.createElement('article'); el.className = 'card';
    const highlightsList = Array.isArray(e.highlights) 
      ? `<ul>${e.highlights.map(h => `<li>${h}</li>`).join('')}</ul>`
      : `<p>${e.highlights}</p>`;
    el.innerHTML = `<h3>${e.company} — ${e.title}</h3><p class="period">${e.period}</p>${highlightsList}`;
    exp.appendChild(el);
  });
  
  // Certifications
  if (cfg.certifications) {
    const certs = document.querySelector('#certifications'); certs.innerHTML = '';
    cfg.certifications.forEach(c => {
      const el = document.createElement('article'); el.className = 'card';
      el.innerHTML = `<h3>${c.name}</h3><p class="period">${c.issuer} — ${c.date}</p>`;
      certs.appendChild(el);
    });
  }
  // Contact
  const contact = document.querySelector('#contact-links'); contact.innerHTML = '';
  Object.entries(cfg.links).forEach(([k,v]) => {
    if (!v) return;
    if (k === 'resume' && typeof v === 'object') {
      contact.innerHTML += `<a href="${v.pdf}" target="_blank" rel="noopener">Resume</a> · `;
    } else {
      const nice = k[0].toUpperCase()+k.slice(1);
      contact.innerHTML += `<a href="${v}" target="_blank" rel="noopener">${nice}</a> · `;
    }
  });

  // Meta
  document.title = cfg.meta.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', cfg.meta.description);
}
loadConfig();
if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('./js/sw.js')); }

// Easter Eggs
let clickCount = 0;
let konamiSequence = [];
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];

// Secondary Easter Egg - Profile Picture Resize Game
let gamerModeUnlocked = false;
let profileResizeMode = false;
let currentProfileSize = 240;
const originalProfileSize = 240;
let isGrowing = false;

// Logo Click Counter & Profile Picture Click
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.brand img');
  if (logo) {
    logo.addEventListener('click', () => {
      clickCount++;
      console.log(`Logo clicks: ${clickCount}`);
      if (clickCount >= 10) {
        showEasterEgg('click-egg');
        clickCount = 0;
      }
    });
  }
  
  // Make profile picture clickable to open image slider or play resize game
  const profilePic = document.querySelector('.profile-pic');
  if (profilePic) {
    profilePic.addEventListener('click', (e) => {
      if (gamerModeUnlocked) {
        e.preventDefault();
        playProfileResizeGame();
      } else {
        openImageSlider();
      }
    });
    profilePic.style.cursor = 'pointer';
  }
});

// Konami Code Detection
document.addEventListener('keydown', (e) => {
  konamiSequence.push(e.code);
  if (konamiSequence.length > konamiCode.length) konamiSequence.shift();
  if (JSON.stringify(konamiSequence) === JSON.stringify(konamiCode)) {
    showEasterEgg('konami-egg');
    gamerModeUnlocked = true; // Unlock secondary easter egg
    console.log('🎮 Gamer mode unlocked! Profile picture resize game activated!');
    konamiSequence = [];
  }
});

// Typing Easter Eggs
let typedSequence = '';
document.addEventListener('keydown', (e) => {
  if (e.key.length === 1) {
    typedSequence += e.key.toLowerCase();
    if (typedSequence.includes('debug') || typedSequence.includes('selenium') || 
        typedSequence.includes('cypress') || typedSequence.includes('playwright')) {
      showEasterEgg('secret-commands');
      typedSequence = '';
    }
    if (typedSequence.length > 20) typedSequence = typedSequence.slice(-10);
  }
});

function showEasterEgg(id) {
  const egg = document.getElementById(id);
  egg.classList.remove('hidden');
  setTimeout(() => egg.classList.add('hidden'), 4000);
  console.log(`🥚 Easter egg activated: ${id}`);
}

// Image Slider Functionality
let currentSlideIndex = 1;

function openImageSlider() {
  document.getElementById('image-slider').classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeImageSlider() {
  document.getElementById('image-slider').classList.add('hidden');
  document.body.style.overflow = 'auto'; // Re-enable scrolling
}

function changeSlide(direction) {
  const slides = document.querySelectorAll('.slider-image');
  const dots = document.querySelectorAll('.dot');
  
  // Remove active class from current slide and dot
  slides[currentSlideIndex - 1].classList.remove('active');
  dots[currentSlideIndex - 1].classList.remove('active');
  
  // Update slide index
  currentSlideIndex += direction;
  
  // Loop around if necessary
  if (currentSlideIndex > slides.length) currentSlideIndex = 1;
  if (currentSlideIndex < 1) currentSlideIndex = slides.length;
  
  // Add active class to new slide and dot
  slides[currentSlideIndex - 1].classList.add('active');
  dots[currentSlideIndex - 1].classList.add('active');
}

function currentSlide(index) {
  const slides = document.querySelectorAll('.slider-image');
  const dots = document.querySelectorAll('.dot');
  
  // Remove active class from all
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  // Set current slide index and add active class
  currentSlideIndex = index;
  slides[currentSlideIndex - 1].classList.add('active');
  dots[currentSlideIndex - 1].classList.add('active');
}

// Close modal when clicking outside of it
document.addEventListener('click', (e) => {
  const modal = document.getElementById('image-slider');
  if (e.target === modal) {
    closeImageSlider();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeImageSlider();
  }
});

// Profile Picture Resize Game
function playProfileResizeGame() {
  const profilePic = document.querySelector('.profile-pic');
  if (!profilePic) return;

  if (!isGrowing && currentProfileSize > 10) {
    // Shrinking phase - reduce by 10%
    currentProfileSize = Math.max(10, currentProfileSize * 0.9);
    console.log(`🔻 Shrinking: ${Math.round(currentProfileSize)}px`);
    
    if (currentProfileSize <= 10) {
      isGrowing = true;
      console.log('🔄 Now growing phase!');
    }
  } else if (isGrowing && currentProfileSize < 300) {
    // Growing phase - increase by 10%
    currentProfileSize = Math.min(300, currentProfileSize * 1.1);
    console.log(`🔺 Growing: ${Math.round(currentProfileSize)}px`);
  } else if (isGrowing && currentProfileSize >= 300) {
    // Explosion phase!
    explodeProfilePicture();
    return;
  }

  // Apply the new size
  profilePic.style.width = `${currentProfileSize}px`;
  profilePic.style.height = `${currentProfileSize}px`;
  profilePic.style.transition = 'width 0.3s ease, height 0.3s ease, transform 0.3s ease';
}

function explodeProfilePicture() {
  const profilePic = document.querySelector('.profile-pic');
  if (!profilePic) return;

  console.log('💥 EXPLOSION!');
  
  // Create explosion effect
  profilePic.style.transform = 'scale(2) rotate(360deg)';
  profilePic.style.opacity = '0';
  profilePic.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
  
  // Create party explosion particles
  createExplosionParticles(profilePic);
  
  // Reset after explosion
  setTimeout(() => {
    resetProfileResizeGame();
  }, 1500);
}

function createExplosionParticles(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Create multiple colorful particles
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = centerX + 'px';
    particle.style.top = centerY + 'px';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
    particle.style.borderRadius = '50%';
    particle.style.zIndex = '3000';
    particle.style.pointerEvents = 'none';
    
    document.body.appendChild(particle);
    
    // Animate particle explosion
    const angle = (Math.PI * 2 * i) / 15;
    const distance = 100 + Math.random() * 50;
    const finalX = centerX + Math.cos(angle) * distance;
    const finalY = centerY + Math.sin(angle) * distance;
    
    particle.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
    setTimeout(() => {
      particle.style.transform = `translate(${finalX - centerX}px, ${finalY - centerY}px) scale(0)`;
      particle.style.opacity = '0';
    }, 50);
    
    // Remove particle after animation
    setTimeout(() => {
      document.body.removeChild(particle);
    }, 900);
  }
}

function resetProfileResizeGame() {
  const profilePic = document.querySelector('.profile-pic');
  if (!profilePic) return;
  
  // Reset all values
  currentProfileSize = originalProfileSize;
  isGrowing = false;
  profileResizeMode = false;
  
  // Reset visual properties
  profilePic.style.width = `${originalProfileSize}px`;
  profilePic.style.height = `${originalProfileSize}px`;
  profilePic.style.transform = 'scale(1) rotate(0deg)';
  profilePic.style.opacity = '1';
  profilePic.style.transition = 'width 0.5s ease, height 0.5s ease, transform 0.5s ease, opacity 0.5s ease';
  
  console.log('🔄 Profile resize game reset!');
}

// Resume Dropdown Toggle
function toggleResumeDropdown() {
  const dropdown = document.getElementById('resume-dropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Close dropdown when clicking elsewhere
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('resume-dropdown');
  const resumeBtn = document.querySelector('.resume-btn');
  
  if (dropdown && !dropdown.contains(e.target) && e.target !== resumeBtn) {
    dropdown.style.display = 'none';
  }
});
