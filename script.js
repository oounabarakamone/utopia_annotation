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

async function loadNotes() {
  const response = await fetch("notes.json");
  notes = await response.json();
  renderLyrics();
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildAliasList() {
  const list = [];
  for (const [key, note] of Object.entries(notes)) {
    for (const alias of note.aliases || [key]) {
      list.push({ key, alias });
    }
  }
  return list.sort((a, b) => b.alias.length - a.alias.length);
}

function renderLyrics() {
  const aliases = buildAliasList();
  let html = escapeHtml(lyricsText);

  for (const { key, alias } of aliases) {
    const escapedAlias = escapeHtml(alias);
    const pattern = new RegExp(escapedAlias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    html = html.replace(pattern, `<span class="term" tabindex="0" data-key="${key}">${escapedAlias}</span>`);
  }

  document.getElementById("lyrics").innerHTML = html;

  document.querySelectorAll(".term").forEach(el => {
    el.addEventListener("click", () => openNote(el.dataset.key));
    el.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openNote(el.dataset.key);
      }
    });
  });
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

loadNotes();
