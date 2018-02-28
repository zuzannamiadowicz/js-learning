let card_click_counter = 0;
let card_1 = null;
let card_2 = null;
let score = 0;
let symbols = ['x', 'x', '@', '@', '$', '$', '^', '^', '*', '*', '#', '#', '%', '%', '&', '&', '~', '~', '+', '+'];
let to_end = symbols.length;
let player_name = '';
let results = [{ name: 'Kuba', score: 666 }];

function on_input(event) {
  document.querySelector('#play').disabled = event.target.value === '';
}

function create_cards() {
  random_table();
  document.querySelector('#cards').innerHTML = '';
  const card_container = document.querySelector('#cards');

  for (let i = 0; i < symbols.length; i++) {
    const card = document.createElement('div');

    card.innerHTML = symbols[i];
    card.classList.add('card', 'cover');
    card.addEventListener('click', card_click);

    card_container.appendChild(card);
  }
}
create_cards();

function card_click(event) {
  if (card_click_counter === 0 && card_1 !== null && card_2 !== null) {
    return;
  } else if (card_click_counter === 1 && card_1 === event.target) {
    return;
  }
  card_click_counter += 1;
  event.target.classList.remove('cover');

  if (card_click_counter === 1) {
    card_1 = event.target;
  }
  if (card_click_counter === 2) {
    card_2 = event.target;
    compare();
    card_click_counter = 0;
  }
}

function random_table() {
  for (let i = 0; i < symbols.length; i++) {
    const random_index = Math.floor(Math.random() * symbols.length);

    if (random_index !== i) {
      const tmp = symbols[i];
      symbols[i] = symbols[random_index];
      symbols[random_index] = tmp;
    }
  }
}

function compare() {
  if (card_1.innerHTML === card_2.innerHTML) {
    score += 100;
    to_end -= 2;
    setTimeout(function() {
      card_1.classList.add('die');
      card_2.classList.add('die');
      card_1 = null;
      card_2 = null;
    }, 500);
  } else {
    score -= 50;

    setTimeout(function() {
      card_1.classList.add('cover');
      card_2.classList.add('cover');
      card_1 = null;
      card_2 = null;
    }, 1000);
  }
  display_score(score);
  if (to_end === 0) {
    setTimeout(game_over, 1200);
  }
}

function game_over() {
  add_to_ranking();
  display_ranking();
  document.querySelector('#container2').style.display = 'none';
  document.querySelector('#container3').style.height = '85vh';
  document.querySelector('#play').style.display = 'flex';
  document.querySelector('#play').innerHTML = 'play again ? ';
  document.querySelector('#ranking').style.display = 'block';
}

function start_game() {
  get_player_name();
  to_end = symbols.length;
  score = 0;
  display_score(score);
  document.querySelector('#ranking').style.display = 'none';
  document.querySelector('#play').style.display = 'none';
  document.querySelector('#player-name').style.display = 'none';
  document.querySelector('#container3').style.height = '15vh';
  document.querySelector('#container2').style.display = 'flex';
  document.querySelector('#score').style.display = 'flex';
  create_cards();
}

function display_score(actual_score) {
  document.querySelector('#score').innerHTML = 'SCORE = ' + actual_score;
}

function get_player_name() {
  player_name = document.querySelector('#player-name').value;
}

function add_to_ranking() {
  results.push({ name: player_name, score: score });
  ranking_sort();
  results = results.slice(0, 5);
}

function display_ranking() {
  document.querySelector('#ranking').innerHTML = '';
  const ranking = document.querySelector('#ranking');
  add_ranking_header();

  let marked = false;
  for (let i = 0; i < results.length; i++) {
    const result = document.createElement('p');
    result.classList.add('row');
    result.innerHTML = `
      <span>${results[i].name}</span>
      <span>${results[i].score}</span>
    `;
    ranking.appendChild(result);

    if (results[i].score === score && results[i].name === player_name && marked === false) {
      result.classList.add('last_result');
      marked = true;
    }
  }
}

function add_ranking_header() {
  const header = document.createElement('p');
  header.classList.add('header');
  header.innerHTML = `
    <span>Name</span>
    <span>Score</span>
  `;
  ranking.appendChild(header);
}

function ranking_sort() {
  for (let i = 0; i < results.length; i++) {
    for (let j = 0; j < results.length; j++) {
      if (results[i].score > results[j].score) {
        let tmp = results[i];
        results[i] = results[j];
        results[j] = tmp;
      }
    }
  }
}
