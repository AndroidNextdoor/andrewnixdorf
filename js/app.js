
async function loadConfig(){
  const res = await fetch('./data/site.config.json');
  const cfg = await res.json();
  // Hero
  document.querySelector('#name').textContent = cfg.name;
  document.querySelector('#role').textContent = cfg.role;
  document.querySelector('#summary').textContent = cfg.summary;
  document.querySelector('#hero-links').innerHTML = `
    <a class="btn" href="${cfg.links.resume}" target="_blank" rel="noopener">View Resume</a>
    <a class="btn ghost" href="${cfg.links.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
    <a class="btn ghost" href="${cfg.links.github}" target="_blank" rel="noopener">GitHub</a>
  `;
  const tags = document.querySelector('#tags'); tags.innerHTML = '';
  cfg.keywords.forEach(k => { const span = document.createElement('span'); span.className = 'tag'; span.textContent = k; tags.appendChild(span); });
  // Projects
  const list = document.querySelector('#projects'); list.innerHTML = '';
  cfg.projects.forEach(p => {
    const el = document.createElement('article'); el.className = 'card';
    el.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="badges">${p.stack.map(s => `<span class="badge">${s}</span>`).join('')}</div>
      <p>${p.links.demo ? `<a href="${p.links.demo}" target="_blank" rel="noopener">Demo</a> · ` : ''}
         <a href="${p.links.repo}" target="_blank" rel="noopener">Source</a></p>`;
    list.appendChild(el);
  });
  // Experience
  const exp = document.querySelector('#experience'); exp.innerHTML = '';
  cfg.experience.forEach(e => {
    const el = document.createElement('article'); el.className = 'card';
    el.innerHTML = `<h3>${e.company} — ${e.title}</h3><p>${e.period}</p><p>${e.highlights}</p>`;
    exp.appendChild(el);
  });
  // Contact
  const contact = document.querySelector('#contact-links'); contact.innerHTML = '';
  Object.entries(cfg.links).forEach(([k,v]) => {
    if (!v) return;
    const nice = k[0].toUpperCase()+k.slice(1);
    contact.innerHTML += `<a href="${v}" target="_blank" rel="noopener">${nice}</a> · `;
  });

  // Meta
  document.title = cfg.meta.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', cfg.meta.description);
}
loadConfig();
if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js')); }
