let clickCount = 0;
let konamiSequence = [];
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];

let gamerModeUnlocked = false;
let profileResizeMode = false;
let currentProfileSize = 240;
const originalProfileSize = 240;
let isGrowing = false;

function initializeEasterEggs() {
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
}

// Initialize immediately since DOM is already loaded when this script runs
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEasterEggs);
} else {
  initializeEasterEggs();
}

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

window.openImageSlider = function() {
  document.getElementById('image-slider').classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
};

window.closeImageSlider = function() {
  document.getElementById('image-slider').classList.add('hidden');
  document.body.style.overflow = 'auto'; // Re-enable scrolling
};

window.changeSlide = function(direction) {
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
};

window.currentSlide = function(index) {
  const slides = document.querySelectorAll('.slider-image');
  const dots = document.querySelectorAll('.dot');
  
  // Remove active class from all
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  // Set current slide index and add active class
  currentSlideIndex = index;
  slides[currentSlideIndex - 1].classList.add('active');
  dots[currentSlideIndex - 1].classList.add('active');
};

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
window.toggleResumeDropdown = function() {
  const dropdown = document.getElementById('resume-dropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
};

// Close dropdown when clicking elsewhere
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('resume-dropdown');
  const resumeBtn = document.querySelector('.resume-btn');
  
  if (dropdown && !dropdown.contains(e.target) && e.target !== resumeBtn) {
    dropdown.style.display = 'none';
  }
});