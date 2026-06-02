let lyricsText = "";
let notes = {};
let aliasEntries = [];

async function loadData() {
  const [lyricsResponse, notesResponse] = await Promise.all([
    fetch("lyrics.txt"),
    fetch("notes.json")
  ]);

  lyricsText = await lyricsResponse.text();
  notes = await notesResponse.json();
  aliasEntries = buildAliasList();

  renderLyrics();
}

function buildAliasList() {
  const list = [];

  for (const [key, note] of Object.entries(notes)) {
    for (const alias of note.aliases || [key]) {
      if (!alias) continue;
      list.push({ key, alias });
    }
  }

  return list.sort((a, b) => b.alias.length - a.alias.length);
}

function renderLyrics() {
  const container = document.getElementById("lyrics");
  container.textContent = "";

  const fragment = document.createDocumentFragment();
  let i = 0;

  while (i < lyricsText.length) {
    const match = findMatchAt(lyricsText, i);

    if (match) {
      const span = document.createElement("span");
      span.className = "term";
      span.tabIndex = 0;
      span.dataset.key = match.key;
      span.textContent = match.alias;

      span.addEventListener("click", () => openNote(match.key));
      span.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openNote(match.key);
        }
      });

      fragment.appendChild(span);
      i += match.alias.length;
    } else {
      fragment.appendChild(document.createTextNode(lyricsText[i]));
      i += 1;
    }
  }

  container.appendChild(fragment);
}

function findMatchAt(text, index) {
  for (const entry of aliasEntries) {
    if (text.startsWith(entry.alias, index)) {
      return entry;
    }
  }

  return null;
}

function findNoritoAt(text, index) {
  if (text[index] !== '"') return null;

  const end = text.indexOf('"', index + 1);

  if (end === -1) return null;

  return {
    text: text.slice(index, end + 1),
    length: end - index + 1
  };
}

function openNote(key) {
  const note = notes[key];
  if (!note) return;

  document.getElementById("noteTitle").textContent = note.title;
  document.getElementById("noteBody").textContent = note.body;
  document.getElementById("overlay").hidden = false;
  document.getElementById("notePanel").hidden = false;
}

function closeNote() {
  document.getElementById("overlay").hidden = true;
  document.getElementById("notePanel").hidden = true;
}

document.getElementById("closeNote").addEventListener("click", closeNote);
document.getElementById("overlay").addEventListener("click", closeNote);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeNote();
});

loadData();
