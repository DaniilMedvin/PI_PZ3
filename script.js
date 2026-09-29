const FLIGHT_RE = /(?<![A-Za-z0-9])([A-Z]{2})[\s-]?(\d{1,4})(?![A-Za-z0-9])/g;

const AIRLINES = {
  PS: 'Ukraine International Airlines',
  LH: 'Lufthansa',
  BA: 'British Airways',
  AF: 'Air France',
  KL: 'KLM',
  LO: 'LOT Polish Airlines',
  TK: 'Turkish Airlines',
  EK: 'Emirates',
  QR: 'Qatar Airways',
  AA: 'American Airlines',
  DL: 'Delta Air Lines',
  UA: 'United Airlines',
  FR: 'Ryanair',
  OS: 'Austrian Airlines',
  LX: 'Swiss',
  AZ: 'ITA Airways',
  IB: 'Iberia',
  SU: 'Aeroflot'
};

const form = document.getElementById('form');
const input = document.getElementById('text');
const status = document.getElementById('status');
const result = document.getElementById('result');
const groupsEl = document.getElementById('groups');
const clearBtn = document.getElementById('clear');

function findFlights(text) {
  const seen = new Set();
  const groups = new Map();
  for (const m of text.matchAll(FLIGHT_RE)) {
    const code = m[1];
    const number = String(Number(m[2]));
    const id = `${code} ${number}`;
    if (seen.has(id)) continue;
    seen.add(id);
    if (!groups.has(code)) groups.set(code, []);
    groups.get(code).push(id);
  }
  return groups;
}

function setStatus(message, isError) {
  status.textContent = message;
  status.classList.toggle('error', isError);
  status.hidden = false;
  input.setAttribute('aria-invalid', String(isError));
}

function render(groups) {
  groupsEl.replaceChildren();
  const codes = [...groups.keys()].sort();
  for (const code of codes) {
    const flights = groups.get(code);

    const group = document.createElement('article');
    group.className = 'group';

    const head = document.createElement('header');
    const codeEl = document.createElement('span');
    codeEl.className = 'code';
    codeEl.textContent = code;
    const nameEl = document.createElement('span');
    nameEl.className = 'name';
    nameEl.textContent = AIRLINES[code] || 'Невідома авіакомпанія';
    const countEl = document.createElement('span');
    countEl.className = 'count';
    countEl.textContent = flights.length;
    head.append(codeEl, nameEl, countEl);

    const list = document.createElement('ul');
    list.className = 'flights';
    for (const f of flights) {
      const li = document.createElement('li');
      li.textContent = f;
      list.append(li);
    }

    group.append(head, list);
    groupsEl.append(group);
  }
  result.hidden = false;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  result.hidden = true;

  if (!text) {
    setStatus('Введіть текст для перевірки.', true);
    input.focus();
    return;
  }

  const groups = findFlights(text);
  if (groups.size === 0) {
    setStatus('Номерів рейсів не знайдено. Формат: дві літери та число, наприклад PS 101.', true);
    input.focus();
    return;
  }

  const total = [...groups.values()].reduce((n, arr) => n + arr.length, 0);
  setStatus(`Перевірку пройдено. Знайдено рейсів: ${total}, авіакомпаній: ${groups.size}.`, false);
  render(groups);
});

clearBtn.addEventListener('click', () => {
  input.value = '';
  input.removeAttribute('aria-invalid');
  status.hidden = true;
  result.hidden = true;
  input.focus();
});
