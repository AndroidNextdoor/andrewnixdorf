
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