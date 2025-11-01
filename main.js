// Frontend demo interactions
const backendStatus = document.getElementById('backendStatus');
const clipsEl = document.getElementById('clips');
const uploader = document.getElementById('uploader');

async function checkBackend(){
  try{
    const res = await fetch('/api/status');
    if(!res.ok) throw new Error('bad');
    const data = await res.json();
    backendStatus.textContent = data.status || 'OK';
  }catch(e){
    backendStatus.textContent = 'Offline';
  }
}

async function loadClips(){
  try{
    const res = await fetch('/api/clips');
    if(!res.ok) throw new Error('err');
    const data = await res.json();
    renderClips(data.clips || []);
  }catch(e){
    clipsEl.innerHTML = '<div class="note">Could not load clips from backend.</div>';
  }
}

function renderClips(list){
  if(list.length===0){
    clipsEl.innerHTML = '<div class="note">No clips yet. Upload one (demo).</div>';
    return;
  }
  clipsEl.innerHTML = '';
  list.forEach(c=>{
    const d = document.createElement('div');
    d.className = 'clip';
    d.innerHTML = `<div><h4>${c.title}</h4><p>${c.description||''}</p></div><div style="text-align:right"><small>${c.date||''}</small></div>`;
    clipsEl.appendChild(d);
  });
}

document.getElementById('openUploader').addEventListener('click', ()=>uploader.classList.remove('hidden'));
document.getElementById('close').addEventListener('click', ()=>uploader.classList.add('hidden'));
document.getElementById('refresh').addEventListener('click', ()=>{ checkBackend(); loadClips(); });

document.getElementById('send').addEventListener('click', async ()=>{
  const title = document.getElementById('title').value || 'Untitled';
  const file = document.getElementById('file').files[0];
  const form = new FormData();
  form.append('title', title);
  if(file) form.append('file', file);
  try{
    const res = await fetch('/api/upload', { method:'POST', body: form });
    const j = await res.json();
    alert(j.message || 'Uploaded (demo)');
    uploader.classList.add('hidden');
    loadClips();
  }catch(e){
    alert('Upload failed (demo).');
  }
});

// initial
checkBackend();
loadClips();
