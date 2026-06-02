const lyricsText = `&quot;誰も神様じゃない　

誰も愛の神様じゃない

君はユートピアの向こう　

教えられたら　繋げたらいい

強烈な　憧れという幻想が必ず

未来の一人を活かすなら

死を受け入れるには

恐怖を打ち倒し　　死を見続けられるなら&quot;

夏の夢を君と見たい

乾いた髪を触って！　

幸せになっちゃいけないなんて

嘘だったんだって

願いはかなって 君と僕は成就して

ーーーーーーって

それで…このあとのゆめは？

夏の夢に君が出てきて

乾いた髪は短くなって

ことばがたりないままのぼくらは

いつかきみが夢見た場所には　きっと

たどり着けるから、問いは叶うから

君の夢を見せて　、神様

&quot;どんな死が待っていても　

いまに死が起こっても

必ず　越えられるように

言葉が　データが　&quot;

&quot;どんな死が待っていても　

いまに死が起こっても

必ず　越えられるように

言葉が&quot;

願いはかなって 君と僕は成就して

両想いなんだって

華々しい恋になるなら

正しい愛になるなら

君の夢を僕は何度も

&quot;どんな死が待っていても　

いまに死が起こっても

必ず　越えられるように

言葉が　データが　

君が&quot;`;

let notes = {};
let aliasEntries = [];

async function loadNotes() {
  const response = await fetch("notes.json");
  notes = await response.json();
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

  // 長い語句を優先。「夏の夢」が「夢」より先に拾われる。
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

loadNotes();
