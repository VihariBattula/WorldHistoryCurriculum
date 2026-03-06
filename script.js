// Date
const d = new Date();
const dateDisplay = document.getElementById("dateDisplay");
if (dateDisplay) {
  dateDisplay.textContent = d.toISOString().split("T")[0];
}

// Reveal Logic
function toggleOne(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = el.style.display === "block" ? "none" : "block";
  }
}

// Toggle Sidebar Groups
function toggleGroup(headerBtn) {
  const group = headerBtn.parentElement;
  if (group) {
    group.classList.toggle("collapsed");
  }
}

// Toggle Sidebar (Mobile)
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const header = document.querySelector(".header");
  if (sidebar && header) {
    sidebar.classList.toggle("mobile-open");
    header.classList.toggle("menu-open");
  }
}

// Navigation Logic
function navigateTo(sectionId, subLinkId = null) {
  const sidebar = document.querySelector(".sidebar");
  const header = document.querySelector(".header");
  if (sidebar) {
    sidebar.classList.remove("mobile-open");
  }
  if (header) {
    header.classList.remove("menu-open");
  }

  const sections = document.querySelectorAll(".content-section");
  sections.forEach((sec) => sec.classList.remove("active"));

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add("active");
  }

  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => item.classList.remove("active"));
  const activeNav = document.getElementById("nav-" + sectionId);
  if (activeNav) {
    activeNav.classList.add("active");
  }

  if (activeNav) {
    let parent = activeNav.parentElement;
    while (parent && !parent.classList.contains("sidebar")) {
      if (parent.classList.contains("nav-group")) {
        parent.classList.remove("collapsed");
      }
      parent = parent.parentElement;
    }
  }

  const mainScroll = document.getElementById("main-scroll");

  if (subLinkId) {
    setTimeout(() => {
      const subTarget = document.getElementById(subLinkId);
      if (subTarget) {
        subTarget.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  } else if (mainScroll) {
    mainScroll.scrollTop = 0;
  }
}

// Wikipedia Search Logic
const wikiSearchInput = document.getElementById('wikiSearchInput');
const wikiSearchResults = document.getElementById('wikiSearchResults');

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

async function searchWikipedia(query) {
  if (!query) {
    wikiSearchResults.innerHTML = '';
    wikiSearchResults.classList.remove('open');
    return;
  }

  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${encodeURIComponent(query)}&srlimit=5`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.query && data.query.search && data.query.search.length > 0) {
      wikiSearchResults.innerHTML = data.query.search.map(result => `
                <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(result.title.replace(/ /g, '_'))}" target="_blank" class="assistant-result-btn" style="text-decoration: none; color: inherit; display: block;">
                    <span class="assistant-result-title" style="display: block; font-weight: 600; font-size: 14px; margin-bottom: 4px; color: var(--text);">${result.title}</span>
                    <span class="assistant-result-snippet" style="display: block; font-size: 13px; color: var(--muted);">${result.snippet}...</span>
                </a>
            `).join('');
      wikiSearchResults.classList.add('open');
    } else {
      wikiSearchResults.innerHTML = '<div class="assistant-empty" style="padding: 16px; font-size: 13px; color: var(--muted); text-align: center;">No results found on Wikipedia.</div>';
      wikiSearchResults.classList.add('open');
    }
  } catch (error) {
    console.error('Wikipedia search error:', error);
    wikiSearchResults.innerHTML = '<div class="assistant-empty" style="padding: 16px; font-size: 13px; color: var(--error); text-align: center;">Error searching Wikipedia.</div>';
    wikiSearchResults.classList.add('open');
  }
}

if (wikiSearchInput && wikiSearchResults) {
  wikiSearchInput.addEventListener('input', debounce((e) => searchWikipedia(e.target.value.trim()), 300));

  // Close results when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#headerSearchShell')) {
      wikiSearchResults.classList.remove('open');
    }
  });

  wikiSearchInput.addEventListener('focus', (e) => {
    if (e.target.value.trim().length > 0) {
      wikiSearchResults.classList.add('open');
    }
  });
}


// --- Interactive Games Logic ---

// ========== FLASHCARDS (Expanded) ==========
const flashcardsData = [
  { front: "What was the 'Blank Check' in WWI?", back: "Germany's promise of unconditional support to Austria-Hungary after the assassination of Archduke Franz Ferdinand." },
  { front: "Who was the leader of the Bolshevik Revolution?", back: "Vladimir Lenin" },
  { front: "What was the Manhattan Project?", back: "The secret US program to develop atomic bombs during WWII." },
  { front: "What crisis brought the US and USSR closest to nuclear war?", back: "The Cuban Missile Crisis (1962)" },
  { front: "Who was the first democratically elected president of South Africa?", back: "Nelson Mandela" },
  { front: "What was the Sykes-Picot Agreement?", back: "A secret 1916 deal between Britain and France to divide the Ottoman Empire." },
  { front: "What is 'Appeasement'?", back: "The policy of making concessions to an aggressor to avoid war — famously used by Britain at Munich (1938)." },
  { front: "What was the Schlieffen Plan?", back: "Germany's strategy to quickly defeat France through Belgium before turning to fight Russia." },
  { front: "What was Glasnost?", back: "Gorbachev's policy of 'openness' — allowing criticism, free press, and intellectual openness in the USSR." },
  { front: "What was the Great Leap Forward?", back: "Mao's 1958–1962 campaign to rapidly industrialize China through communes and backyard furnaces. Resulted in history's worst famine." },
  { front: "What is Pan-Africanism?", back: "A movement to unify African nations politically and economically — championed by Kwame Nkrumah." },
  { front: "What was the Balfour Declaration?", back: "A 1917 British statement supporting the establishment of a Jewish homeland in Palestine." },
  { front: "What is Satyagraha?", back: "Gandhi's philosophy of 'truth-force' — non-violent civil disobedience to resist injustice." },
  { front: "What was the Wannsee Conference?", back: "The 1942 meeting where Nazi leaders formalized the 'Final Solution' — the industrialized genocide of European Jews." },
  { front: "What are the 'Four Olds'?", back: "Old ideas, culture, customs, and habits — targeted for destruction during Mao's Cultural Revolution." }
];
let currentCardIndex = 0;

function startFlashcards() {
  const container = document.getElementById('game-container');
  if (container) { container.style.display = 'block'; currentCardIndex = 0; renderFlashcard(); container.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
}
function renderFlashcard() {
  const container = document.getElementById('game-container');
  const card = flashcardsData[currentCardIndex];
  container.innerHTML = `
    <div class="embed-header"><span class="embed-icon">🃏</span> Historical Flashcards <button onclick="document.getElementById('game-container').style.display='none'" class="btn-reveal" style="font-size:12px;padding:4px 8px;min-height:0;margin-left:auto;">Close</button></div>
    <div class="flashcard-wrapper" onclick="this.querySelector('.flashcard').classList.toggle('flipped')">
      <div class="flashcard">
        <div class="flashcard-front"><span style="font-size:13px;color:var(--muted);margin-bottom:12px;">Click to flip</span><h3 style="margin:0;font-size:20px;">${card.front}</h3></div>
        <div class="flashcard-back"><h3 style="margin:0;font-size:17px;line-height:1.5;">${card.back}</h3></div>
      </div>
    </div>
    <div class="flashcard-nav">
      <button class="btn-reveal" onclick="prevCard()" ${currentCardIndex === 0 ? 'disabled style="opacity:.5;cursor:not-allowed"' : ''}>← Previous</button>
      <span style="font-weight:600;align-self:center;">${currentCardIndex + 1} / ${flashcardsData.length}</span>
      <button class="btn-reveal" onclick="nextCard()" ${currentCardIndex === flashcardsData.length - 1 ? 'disabled style="opacity:.5;cursor:not-allowed"' : ''}>Next →</button>
    </div>`;
}
function prevCard() { if (currentCardIndex > 0) { currentCardIndex--; renderFlashcard(); } }
function nextCard() { if (currentCardIndex < flashcardsData.length - 1) { currentCardIndex++; renderFlashcard(); } }

// ========== TIMELINE SORTER (existing, unchanged) ==========
const timelineEventsData = [
  { text: 'Assassination of Archduke Franz Ferdinand', year: 1914 },
  { text: 'Bolshevik Revolution', year: 1917 },
  { text: 'Invasion of Poland (Start of WWII)', year: 1939 },
  { text: 'Indian Independence & Partition', year: 1947 },
  { text: 'Cuban Missile Crisis', year: 1962 },
  { text: 'Fall of Saigon', year: 1975 },
  { text: 'Fall of the Berlin Wall', year: 1989 },
  { text: 'September 11 Attacks', year: 2001 }
];

function startTimelineGame() {
  const container = document.getElementById('game-container');
  if (!container) return;
  container.style.display = 'block';
  let shuffled = [...timelineEventsData].sort(() => Math.random() - 0.5);
  container.innerHTML = `
    <div class="embed-header"><span class="embed-icon">📅</span> Timeline Sorter <button onclick="document.getElementById('game-container').style.display='none'" class="btn-reveal" style="font-size:12px;padding:4px 8px;min-height:0;margin-left:auto;">Close</button></div>
    <p class="embed-desc">Drag and drop the events to place them in chronological order (oldest at the top).</p>
    <div id="timeline-list">${shuffled.map(ev => `<div class="timeline-event" draggable="true" data-year="${ev.year}"><span style="font-size:20px;color:var(--muted);cursor:grab;">↕</span><strong>${ev.text}</strong></div>`).join('')}</div>
    <div style="margin-top:16px;display:flex;gap:12px;align-items:center;">
      <button class="embed-check-btn" onclick="checkTimeline()">Check Order</button>
      <span id="timeline-result" style="font-weight:600;"></span>
    </div>`;
  const draggables = document.querySelectorAll('.timeline-event');
  const list = document.getElementById('timeline-list');
  draggables.forEach(d => { d.addEventListener('dragstart', () => d.classList.add('dragging')); d.addEventListener('dragend', () => d.classList.remove('dragging')); });
  list.addEventListener('dragover', e => { e.preventDefault(); const after = getDragAfterElement(list, e.clientY); const dr = document.querySelector('.dragging'); if (dr) { after == null ? list.appendChild(dr) : list.insertBefore(dr, after); } });
  container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function getDragAfterElement(container, y) {
  return [...container.querySelectorAll('.timeline-event:not(.dragging)')].reduce((closest, child) => {
    const box = child.getBoundingClientRect(); const offset = y - box.top - box.height / 2;
    return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
function checkTimeline() {
  const els = document.querySelectorAll('.timeline-event'); let ok = true, prev = -Infinity;
  els.forEach(el => { const y = parseInt(el.dataset.year); if (y < prev) ok = false; prev = y; });
  const r = document.getElementById('timeline-result');
  r.textContent = ok ? "✓ Correct! Perfect chronological order." : "✗ Not quite — try rearranging!";
  r.style.color = ok ? "#065f46" : "#ef4444";
}

// ========== WHO AM I? (Hub Game) ==========
const whoAmIData = [
  { clues: ["I was born into a wealthy Saudi family.", "I fought against the Soviet Union in Afghanistan.", "I founded a Sunni terrorist organization.", "I was responsible for the September 11 attacks."], answer: "Osama bin Laden" },
  { clues: ["I led India to independence through non-violence.", "I organized the famous Salt March.", "My philosophy is called Satyagraha.", "I am known as the 'Father of India'."], answer: "Mahatma Gandhi" },
  { clues: ["I was a military leader in Cuba.", "I overthrew a US-backed dictator named Batista.", "I allied with the Soviet Union during the Cold War.", "I ruled Cuba for nearly 50 years."], answer: "Fidel Castro" },
  { clues: ["I was imprisoned for 27 years.", "I fought against Apartheid in South Africa.", "I became the first Black president of my country.", "I won the Nobel Peace Prize in 1993."], answer: "Nelson Mandela" },
  { clues: ["I modernized Turkey after the Ottoman collapse.", "I abolished the caliphate and adopted the Latin alphabet.", "I separated religion from government.", "I am known as 'Father of the Turks'."], answer: "Mustafa Kemal Atatürk" }
];
let whoAmIIndex = 0, whoAmIClueIndex = 0;

function startWhoAmI() {
  const container = document.getElementById('game-container');
  if (!container) return;
  container.style.display = 'block'; whoAmIIndex = 0; whoAmIClueIndex = 0;
  renderWhoAmI(); container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function renderWhoAmI() {
  const container = document.getElementById('game-container');
  const person = whoAmIData[whoAmIIndex]; whoAmIClueIndex = 0;
  container.innerHTML = `
    <div class="embed-header"><span class="embed-icon">🕴️</span> Who Am I? <button onclick="document.getElementById('game-container').style.display='none'" class="btn-reveal" style="font-size:12px;padding:4px 8px;min-height:0;margin-left:auto;">Close</button></div>
    <p class="embed-desc">Clues will appear one by one. Can you guess the historical figure with the fewest clues?</p>
    <div id="wai-clues">${person.clues.map((c, i) => `<div class="who-am-i-clue" id="wai-clue-${i}">Clue ${i + 1}: ${c}</div>`).join('')}</div>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
      <button class="embed-check-btn" onclick="revealNextClue()">Reveal Next Clue</button>
      <button class="embed-check-btn" style="background:#334155;" onclick="revealWhoAmI()">Show Answer</button>
      <button class="btn-reveal" onclick="nextWhoAmI()" style="margin-left:auto;">Next Person →</button>
    </div>
    <div id="wai-answer" class="embed-result"></div>
    <p style="margin-top:8px;font-size:13px;color:var(--muted);">Person ${whoAmIIndex + 1} of ${whoAmIData.length}</p>`;
  setTimeout(() => revealNextClue(), 100);
}
function revealNextClue() {
  const el = document.getElementById('wai-clue-' + whoAmIClueIndex);
  if (el) { el.classList.add('revealed'); whoAmIClueIndex++; }
}
function revealWhoAmI() {
  const person = whoAmIData[whoAmIIndex]; const r = document.getElementById('wai-answer');
  r.className = 'embed-result show success'; r.textContent = '🎯 Answer: ' + person.answer;
  // reveal all remaining clues
  whoAmIData[whoAmIIndex].clues.forEach((_, i) => { const el = document.getElementById('wai-clue-' + i); if (el) el.classList.add('revealed'); });
}
function nextWhoAmI() { whoAmIIndex = (whoAmIIndex + 1) % whoAmIData.length; renderWhoAmI(); }

// ========== VOCABULARY MATCHER (Hub Game) ==========
const vocabPairs = [
  { term: "Appeasement", def: "Making concessions to avoid war" },
  { term: "Blitzkrieg", def: "Lightning war strategy using speed" },
  { term: "Containment", def: "US policy to stop communism's spread" },
  { term: "Perestroika", def: "Gorbachev's economic restructuring" },
  { term: "Glasnost", def: "Gorbachev's policy of openness" },
  { term: "Pan-Africanism", def: "Movement to unify African nations" },
  { term: "Satyagraha", def: "Gandhi's non-violent resistance philosophy" },
  { term: "Neocolonialism", def: "Economic control after political independence" }
];
let vocabSelected = null;

function startVocabGame() {
  const container = document.getElementById('game-container');
  if (!container) return;
  container.style.display = 'block';
  const shuffledTerms = [...vocabPairs].sort(() => Math.random() - 0.5);
  const shuffledDefs = [...vocabPairs].sort(() => Math.random() - 0.5);
  container.innerHTML = `
    <div class="embed-header"><span class="embed-icon">📚</span> Vocabulary Matcher <button onclick="document.getElementById('game-container').style.display='none'" class="btn-reveal" style="font-size:12px;padding:4px 8px;min-height:0;margin-left:auto;">Close</button></div>
    <p class="embed-desc">Click a term, then click its matching definition. Match all pairs to win!</p>
    <div class="match-columns">
      <div class="match-column"><h4>Terms</h4><div class="vocab-grid" id="vocab-terms">${shuffledTerms.map(p => `<div class="vocab-card" data-pair="${p.term}" data-type="term" onclick="selectVocab(this)">${p.term}</div>`).join('')}</div></div>
      <div class="match-column"><h4>Definitions</h4><div class="vocab-grid" id="vocab-defs">${shuffledDefs.map(p => `<div class="vocab-card" data-pair="${p.term}" data-type="def" onclick="selectVocab(this)">${p.def}</div>`).join('')}</div></div>
    </div>
    <div id="vocab-result" class="embed-result"></div>`;
  vocabSelected = null;
  container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function selectVocab(el) {
  if (el.classList.contains('matched')) return;
  if (!vocabSelected) { vocabSelected = el; el.classList.add('selected'); return; }
  if (vocabSelected.dataset.type === el.dataset.type) { vocabSelected.classList.remove('selected'); vocabSelected = el; el.classList.add('selected'); return; }
  if (vocabSelected.dataset.pair === el.dataset.pair) {
    vocabSelected.classList.remove('selected'); vocabSelected.classList.add('matched'); el.classList.add('matched'); vocabSelected = null;
    if (document.querySelectorAll('.vocab-card:not(.matched)').length === 0) {
      const r = document.getElementById('vocab-result'); r.className = 'embed-result show success'; r.textContent = '🎉 Perfect! All terms matched!';
    }
  } else {
    vocabSelected.classList.remove('selected'); vocabSelected.classList.add('wrong'); el.classList.add('wrong');
    const prev = vocabSelected; vocabSelected = null;
    setTimeout(() => { prev.classList.remove('wrong'); el.classList.remove('wrong'); }, 500);
  }
}

// ========== CAUSE & EFFECT MATCHER (Hub Game) ==========
function startCauseEffect() {
  const container = document.getElementById('game-container');
  if (!container) return;
  container.style.display = 'block';
  const pairs = [
    { cause: "Treaty of Versailles humiliates Germany", effect: "Rise of Hitler and Nazi Party" },
    { cause: "Japan attacks Pearl Harbor", effect: "US enters World War II" },
    { cause: "Soviet missiles placed in Cuba", effect: "Cuban Missile Crisis & naval blockade" },
    { cause: "Gorbachev introduces Glasnost", effect: "Collapse of the Soviet Union" },
    { cause: "Belgium issues ethnic identity cards in Rwanda", effect: "Hutus and Tutsis divided, leading to genocide" }
  ];
  const shuffledEffects = [...pairs].sort(() => Math.random() - 0.5);
  container.innerHTML = `
    <div class="embed-header"><span class="embed-icon">🔗</span> Cause & Effect Matcher <button onclick="document.getElementById('game-container').style.display='none'" class="btn-reveal" style="font-size:12px;padding:4px 8px;min-height:0;margin-left:auto;">Close</button></div>
    <p class="embed-desc">Click a cause, then click the correct effect that it led to.</p>
    <div class="match-columns">
      <div class="match-column"><h4>Causes</h4><div class="vocab-grid">${pairs.map((p, i) => `<div class="vocab-card" data-pair="${i}" data-type="term" onclick="selectVocab(this)">${p.cause}</div>`).join('')}</div></div>
      <div class="match-column"><h4>Effects</h4><div class="vocab-grid">${shuffledEffects.map(p => `<div class="vocab-card" data-pair="${pairs.indexOf(p)}" data-type="def" onclick="selectVocab(this)">${p.effect}</div>`).join('')}</div></div>
    </div>
    <div id="vocab-result" class="embed-result"></div>`;
  vocabSelected = null;
  container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ========== IN-UNIT EMBEDDED ACTIVITIES ==========

// --- Unit 1: Treaty Builder ---
function initTreatyBuilder() {
  const el = document.getElementById('treaty-builder');
  if (!el) return;
  const clauses = [
    { text: "War Guilt Clause (Article 231)", correct: "harsh" },
    { text: "$33 Billion in Reparations", correct: "harsh" },
    { text: "League of Nations created", correct: "fair" },
    { text: "Self-determination for Europeans", correct: "fair" },
    { text: "Germany loses all colonies", correct: "harsh" },
    { text: "Military limited to 100,000", correct: "harsh" },
    { text: "Freedom of navigation on seas", correct: "fair" },
    { text: "No self-determination for colonies", correct: "harsh" }
  ];
  const shuffled = [...clauses].sort(() => Math.random() - 0.5);
  el.innerHTML = `
    <div class="embed-header"><span class="embed-icon">⚖️</span> Interactive: Treaty Builder</div>
    <p class="embed-desc">Categorize each clause of the Treaty of Versailles. Was it "Fair" or "Harsh" toward Germany? Drag each clause to the correct column.</p>
    <div class="options-pool" id="treaty-pool">${shuffled.map(c => `<div class="drag-option" draggable="true" data-correct="${c.correct}">${c.text}</div>`).join('')}</div>
    <div class="match-columns">
      <div class="match-column"><h4>Fair / Idealistic</h4><div class="match-dropzone" id="treaty-fair" data-zone="fair"></div></div>
      <div class="match-column"><h4>Harsh / Punitive</h4><div class="match-dropzone" id="treaty-harsh" data-zone="harsh"></div></div>
    </div>
    <button class="embed-check-btn" onclick="checkTreatyBuilder()">Check Answers</button>
    <div id="treaty-result" class="embed-result"></div>`;
  setupDragDrop('treaty-pool');
}
function checkTreatyBuilder() {
  let correct = 0, total = 0;
  document.querySelectorAll('#treaty-fair .drag-option, #treaty-harsh .drag-option').forEach(opt => {
    total++;
    const zone = opt.closest('.match-dropzone').dataset.zone;
    if (opt.dataset.correct === zone) { opt.classList.add('correct'); opt.classList.remove('incorrect'); correct++; }
    else { opt.classList.add('incorrect'); opt.classList.remove('correct'); }
  });
  const r = document.getElementById('treaty-result');
  r.className = correct === total ? 'embed-result show success' : 'embed-result show error';
  r.textContent = correct === total ? `🎉 Perfect! All ${total} clauses sorted correctly!` : `${correct}/${total} correct. Review the red items and try again!`;
}

// --- Unit 2: Strategy Simulator ---
function initStrategySim() {
  const el = document.getElementById('strategy-sim');
  if (!el) return;
  el.innerHTML = `
    <div class="embed-header"><span class="embed-icon">🗺️</span> Interactive: Blitzkrieg Strategy Sim</div>
    <p class="embed-desc">You are a German general in 1940. How do you invade France? Choose your attack route and see the historical outcome.</p>
    <div class="strategy-choices" id="strat-choices">
      <div class="strategy-choice" onclick="chooseStrategy(this, 'maginot')"><strong>Option A:</strong> Direct assault on the Maginot Line</div>
      <div class="strategy-choice" onclick="chooseStrategy(this, 'belgium')"><strong>Option B:</strong> Sweep through Belgium (Schlieffen Plan)</div>
      <div class="strategy-choice" onclick="chooseStrategy(this, 'ardennes')"><strong>Option C:</strong> Strike through the Ardennes Forest</div>
    </div>
    <div id="strat-result" class="embed-result"></div>`;
}
function chooseStrategy(btn, choice) {
  document.querySelectorAll('.strategy-choice').forEach(b => b.classList.remove('chosen'));
  btn.classList.add('chosen');
  const r = document.getElementById('strat-result');
  const outcomes = {
    maginot: { cls: 'error', msg: '✗ The Maginot Line was a fortress of concrete and steel. A direct assault would be suicidal — France built it specifically to stop this attack. Try again!' },
    belgium: { cls: 'error', msg: '⚠️ Close! This was the Schlieffen Plan from WWI. But the Allies expected this route and placed their best troops in Belgium. The real plan was more cunning...' },
    ardennes: { cls: 'success', msg: '✓ Correct! Germany pushed Panzer divisions through the "impassable" Ardennes Forest, bypassing both the Maginot Line AND the Allied forces in Belgium. This trapped the British at Dunkirk and France fell in just 6 weeks.' }
  };
  const o = outcomes[choice];
  r.className = 'embed-result show ' + o.cls; r.textContent = o.msg;
}

// --- Unit 3: Cold War Alignment ---
function initColdWarAlignment() {
  const el = document.getElementById('cold-war-alignment');
  if (!el) return;
  const nations = [
    { name: "West Germany", correct: "nato" }, { name: "Poland", correct: "warsaw" },
    { name: "France", correct: "nato" }, { name: "East Germany", correct: "warsaw" },
    { name: "Hungary", correct: "warsaw" }, { name: "United Kingdom", correct: "nato" },
    { name: "Czechoslovakia", correct: "warsaw" }, { name: "United States", correct: "nato" },
    { name: "Romania", correct: "warsaw" }, { name: "Canada", correct: "nato" }
  ];
  const shuffled = [...nations].sort(() => Math.random() - 0.5);
  el.innerHTML = `
    <div class="embed-header"><span class="embed-icon">🌍</span> Interactive: Cold War Alignment</div>
    <p class="embed-desc">Sort these nations into their correct Cold War military alliance.</p>
    <div class="options-pool" id="cw-pool">${shuffled.map(n => `<div class="drag-option" draggable="true" data-correct="${n.correct}">${n.name}</div>`).join('')}</div>
    <div class="match-columns">
      <div class="match-column"><h4>NATO (Western)</h4><div class="match-dropzone" id="cw-nato" data-zone="nato"></div></div>
      <div class="match-column"><h4>Warsaw Pact (Soviet)</h4><div class="match-dropzone" id="cw-warsaw" data-zone="warsaw"></div></div>
    </div>
    <button class="embed-check-btn" onclick="checkAlignment()">Check Answers</button>
    <div id="cw-result" class="embed-result"></div>`;
  setupDragDrop('cw-pool');
}
function checkAlignment() {
  let correct = 0, total = 0;
  document.querySelectorAll('#cw-nato .drag-option, #cw-warsaw .drag-option').forEach(opt => {
    total++; const zone = opt.closest('.match-dropzone').dataset.zone;
    if (opt.dataset.correct === zone) { opt.classList.add('correct'); opt.classList.remove('incorrect'); correct++; }
    else { opt.classList.add('incorrect'); opt.classList.remove('correct'); }
  });
  const r = document.getElementById('cw-result');
  r.className = correct === total ? 'embed-result show success' : 'embed-result show error';
  r.textContent = correct === total ? `🎉 Perfect! All ${total} nations placed correctly!` : `${correct}/${total} correct. Review the red items!`;
}

// --- Unit 4: African Independence Timeline ---
function initIndependenceTimeline() {
  const el = document.getElementById('independence-timeline');
  if (!el) return;
  const nations = [
    { name: "Libya", year: 1951 }, { name: "Ghana", year: 1957 },
    { name: "Guinea", year: 1958 }, { name: "Nigeria", year: 1960 },
    { name: "Kenya", year: 1963 }, { name: "Algeria", year: 1962 },
    { name: "Mozambique", year: 1975 }
  ];
  const shuffled = [...nations].sort(() => Math.random() - 0.5);
  el.innerHTML = `
    <div class="embed-header"><span class="embed-icon">🗓️</span> Interactive: African Independence Timeline</div>
    <p class="embed-desc">Drag these African nations into the correct chronological order of independence (earliest first).</p>
    <div id="africa-list">${shuffled.map(n => `<div class="timeline-event" draggable="true" data-year="${n.year}"><span style="font-size:18px;color:var(--muted);cursor:grab;">↕</span><strong>${n.name}</strong> <span style="color:var(--muted);font-size:12px;">(drag me)</span></div>`).join('')}</div>
    <button class="embed-check-btn" onclick="checkAfricaTimeline()">Check Order</button>
    <div id="africa-result" class="embed-result"></div>`;
  const draggables = el.querySelectorAll('.timeline-event');
  const list = document.getElementById('africa-list');
  draggables.forEach(d => { d.addEventListener('dragstart', () => d.classList.add('dragging')); d.addEventListener('dragend', () => d.classList.remove('dragging')); });
  list.addEventListener('dragover', e => { e.preventDefault(); const after = getDragAfterElement(list, e.clientY); const dr = document.querySelector('.dragging'); if (dr) { after == null ? list.appendChild(dr) : list.insertBefore(dr, after); } });
}
function checkAfricaTimeline() {
  const els = document.querySelectorAll('#africa-list .timeline-event'); let ok = true, prev = -Infinity;
  els.forEach(el => { const y = parseInt(el.dataset.year); if (y < prev) ok = false; prev = y; });
  const r = document.getElementById('africa-result');
  r.className = ok ? 'embed-result show success' : 'embed-result show error';
  r.textContent = ok ? "✓ Correct! Perfect chronological order." : "✗ Not quite — check the order and try again.";
}

// --- Unit 5: Mao's Policy Consequences ---
function initPolicyConsequences() {
  const el = document.getElementById('policy-consequences');
  if (!el) return;
  const policies = [
    { policy: "Great Leap Forward", consequence: "Worst famine in history (15-45 million dead)" },
    { policy: "Cultural Revolution", consequence: "Intellectuals persecuted, education destroyed" },
    { policy: "One-Child Policy", consequence: "Gender imbalance and aging workforce" },
    { policy: "Four Modernizations", consequence: "Rapid economic growth and foreign investment" },
    { policy: "Tiananmen Square crackdown", consequence: "Democracy movement crushed, thousands killed" }
  ];
  const shuffledCons = [...policies].sort(() => Math.random() - 0.5);
  el.innerHTML = `
    <div class="embed-header"><span class="embed-icon">🇨🇳</span> Interactive: Policy → Consequence</div>
    <p class="embed-desc">Match each Chinese policy to its historical consequence.</p>
    <div class="match-columns">
      <div class="match-column"><h4>Policies</h4><div class="vocab-grid">${policies.map((p, i) => `<div class="vocab-card" data-pair="${i}" data-type="term" onclick="selectVocab(this)">${p.policy}</div>`).join('')}</div></div>
      <div class="match-column"><h4>Consequences</h4><div class="vocab-grid">${shuffledCons.map(p => `<div class="vocab-card" data-pair="${policies.indexOf(p)}" data-type="def" onclick="selectVocab(this)">${p.consequence}</div>`).join('')}</div></div>
    </div>
    <div id="vocab-result" class="embed-result"></div>`;
  vocabSelected = null;
}

// --- Unit 6: Middle East Conflict Mapper ---
function initConflictMapper() {
  const el = document.getElementById('conflict-mapper');
  if (!el) return;
  const conflicts = [
    { name: "Suez Crisis (1956)", correct: "egypt" },
    { name: "Six-Day War (1967)", correct: "israel" },
    { name: "Iranian Revolution (1979)", correct: "iran" },
    { name: "Iran-Iraq War (1980–88)", correct: "iraq" },
    { name: "First Gulf War (1990–91)", correct: "kuwait" },
    { name: "Camp David Accords (1978)", correct: "egypt" }
  ];
  const shuffled = [...conflicts].sort(() => Math.random() - 0.5);
  const regions = ["egypt", "israel", "iran", "iraq", "kuwait"];
  el.innerHTML = `
    <div class="embed-header"><span class="embed-icon">📍</span> Interactive: Conflict Mapper</div>
    <p class="embed-desc">Drag each conflict event to the region it is most closely associated with.</p>
    <div class="options-pool" id="conflict-pool">${shuffled.map(c => `<div class="drag-option" draggable="true" data-correct="${c.correct}">${c.name}</div>`).join('')}</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;">
      ${regions.map(r => `<div><h4 style="font-size:12px;text-transform:uppercase;color:var(--muted);margin-bottom:6px;">${r.charAt(0).toUpperCase() + r.slice(1)}</h4><div class="match-dropzone" data-zone="${r}" style="min-height:60px;"></div></div>`).join('')}
    </div>
    <button class="embed-check-btn" onclick="checkConflictMapper()">Check Answers</button>
    <div id="conflict-result" class="embed-result"></div>`;
  setupDragDrop('conflict-pool');
}
function checkConflictMapper() {
  let correct = 0, total = 0;
  document.querySelectorAll('#conflict-mapper .match-dropzone .drag-option').forEach(opt => {
    total++; const zone = opt.closest('.match-dropzone').dataset.zone;
    if (opt.dataset.correct === zone) { opt.classList.add('correct'); opt.classList.remove('incorrect'); correct++; }
    else { opt.classList.add('incorrect'); opt.classList.remove('correct'); }
  });
  const r = document.getElementById('conflict-result');
  r.className = correct === total ? 'embed-result show success' : 'embed-result show error';
  r.textContent = correct === total ? `🎉 All ${total} correctly placed!` : `${correct}/${total} correct. Review the red items!`;
}

// --- Unit 7: Revolution Match ---
function initRevolutionMatch() {
  const el = document.getElementById('revolution-match');
  if (!el) return;
  const revs = [
    { leader: "Fidel Castro", event: "Cuban Revolution (1959)" },
    { leader: "Emiliano Zapata", event: "Mexican Revolution (1910)" },
    { leader: "Salvador Allende", event: "Chilean socialism (overthrown 1973)" },
    { leader: "Augusto Pinochet", event: "Chilean military dictatorship" },
    { leader: "Jacobo Árbenz", event: "Guatemalan land reform (CIA coup 1954)" }
  ];
  const shuffledEvents = [...revs].sort(() => Math.random() - 0.5);
  el.innerHTML = `
    <div class="embed-header"><span class="embed-icon">✊</span> Interactive: Revolution Match</div>
    <p class="embed-desc">Match each Latin American leader to their revolution or political event.</p>
    <div class="match-columns">
      <div class="match-column"><h4>Leaders</h4><div class="vocab-grid">${revs.map((r, i) => `<div class="vocab-card" data-pair="${i}" data-type="term" onclick="selectVocab(this)">${r.leader}</div>`).join('')}</div></div>
      <div class="match-column"><h4>Events</h4><div class="vocab-grid">${shuffledEvents.map(r => `<div class="vocab-card" data-pair="${revs.indexOf(r)}" data-type="def" onclick="selectVocab(this)">${r.event}</div>`).join('')}</div></div>
    </div>
    <div id="vocab-result" class="embed-result"></div>`;
  vocabSelected = null;
}

// ========== GENERIC DRAG-AND-DROP SETUP ==========
function setupDragDrop(poolId) {
  const pool = document.getElementById(poolId);
  if (!pool) return;
  const options = pool.querySelectorAll('.drag-option');
  const dropzones = pool.closest('.interactive-embed').querySelectorAll('.match-dropzone');

  options.forEach(opt => {
    opt.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', ''); opt.classList.add('dragging'); });
    opt.addEventListener('dragend', () => opt.classList.remove('dragging'));
  });

  dropzones.forEach(zone => {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault(); zone.classList.remove('drag-over');
      const dragging = document.querySelector('.drag-option.dragging');
      if (dragging) zone.appendChild(dragging);
    });
  });

  // Allow dragging back to pool
  pool.addEventListener('dragover', e => e.preventDefault());
  pool.addEventListener('drop', e => {
    e.preventDefault();
    const dragging = document.querySelector('.drag-option.dragging');
    if (dragging) pool.appendChild(dragging);
  });
}

// ========== INITIALIZE EMBEDDED ACTIVITIES ON PAGE LOAD ==========
document.addEventListener('DOMContentLoaded', () => {
  initTreatyBuilder();
  initStrategySim();
  initColdWarAlignment();
  initIndependenceTimeline();
  initPolicyConsequences();
  initConflictMapper();
  initRevolutionMatch();
});

// ========== EXPORT ALL FUNCTIONS ==========
window.toggleOne = toggleOne;
window.toggleGroup = toggleGroup;
window.navigateTo = navigateTo;
window.toggleSidebar = toggleSidebar;
window.startFlashcards = startFlashcards;
window.prevCard = prevCard;
window.nextCard = nextCard;
window.startTimelineGame = startTimelineGame;
window.checkTimeline = checkTimeline;
window.startWhoAmI = startWhoAmI;
window.revealNextClue = revealNextClue;
window.revealWhoAmI = revealWhoAmI;
window.nextWhoAmI = nextWhoAmI;
window.startVocabGame = startVocabGame;
window.selectVocab = selectVocab;
window.startCauseEffect = startCauseEffect;
window.chooseStrategy = chooseStrategy;
window.checkAlignment = checkAlignment;
window.checkAfricaTimeline = checkAfricaTimeline;
window.checkConflictMapper = checkConflictMapper;
window.checkTreatyBuilder = checkTreatyBuilder;
