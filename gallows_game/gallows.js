let clue = '';
let invalid_counter = 0;
let underscored_counter = clue.length;
let underscored_clue = '';

const clues = [
  'wytwórstwo chałupnicze',
  'Demokratyczna Republika Konga ',
  'Lecznica dla zwierząt',
  'Wybrzeże Kości Słoniowej',
  'Burza mózgów',
  'Przechodzić samego siebie',
  'Tępy jak osioł',
  'Raz kozie śmierć',
  'Gdzie dwóch sie bije tam trzeci korzysta',
  'Panna z Mokrą Głową',
  'Nie wywołuj wilka z lasu',
  'Głowa Pusta jak kapusta',
  'Drapieżny jak lew',
  'M jak miłość',
  'Chaos',
  'Syrenka',
  'Kluski Śląskie',
  'Taniec Brzucha',
  'Casino Royal',
  'Hawaje',
  'Cylinder',
  'Z deszczu pod rynne'
];

function random_clue() {
  return clues[Math.floor(Math.random() * clues.length)];
}

function start_game() {
  clue = random_clue().toUpperCase();
  clear_letters();
  underscored_clue = '';
  let clue_counter = 0;
  do {
    underscored_clue += '_';
    clue_counter += 1;
  } while (clue_counter < clue.length);
  document.getElementById('board').innerHTML = underscored_clue;
  invalid_counter = 0;
  underscored_counter = clue.length;
  add_space();
  document.getElementById('button_new_game').style.display = 'none';
  document.getElementById('container_2').style.visibility = 'visible';
}

function letter_click(event) {
  event.target.disabled = true;
  const letter = event.target.innerHTML;
  let letter_index = clue.indexOf(letter);

  if (letter_index === -1) {
    event.target.classList.add('invalid');
    invalid_counter += 1;
    current_img();
  } else {
    event.target.classList.add('valid');
    while (letter_index !== -1) {
      underscored_clue = underscored_clue.substr(0, letter_index) + letter + underscored_clue.substr(letter_index + 1);
      underscored_counter -= 1;
      letter_index = clue.indexOf(letter, letter_index + 1);
    }
    document.getElementById('board').innerHTML = underscored_clue;
    if (underscored_counter === 0) {
      winner();
    }
  }
}

function current_img() {
  document.querySelector('.gallow-image').style.display = 'block';
  const image = document.querySelector('.gallow-image');
  image.src = './img/' + invalid_counter + '.png';
  if (invalid_counter === 9) {
    game_over();
  }
}

function game_over() {
  document.querySelector('#board').innerHTML = 'GAME OVER';
  document.querySelector('#button_new_game').style.display = 'block';
  document.querySelector('#button_new_game').innerHTML = 'PLAY AGAIN';

  const letters = document.querySelectorAll('.letter');
  for (let i = 0; i < letters.length; i++) {
    letters[i].disabled = true;
  }
}

function clear_letters() {
  const letters = document.querySelectorAll('.letter');
  for (let i = 0; i < letters.length; i++) {
    letters[i].disabled = false;
    letters[i].classList.remove('invalid', 'valid');
  }
  document.querySelector('.gallow-image').style.display = 'none';
}

function add_space() {
  let space_index = clue.indexOf(' ');
  while (space_index !== -1) {
    underscored_clue = underscored_clue.substr(0, space_index) + ' ' + underscored_clue.substr(space_index + 1);
    underscored_counter -= 1;
    space_index = clue.indexOf(' ', space_index + 1);
  }
  document.getElementById('board').innerHTML = underscored_clue;
}

function winner() {
  setTimeout(function() {
    document.getElementById('board').innerHTML = 'WINNER!';
  }, 2000);
  document.querySelector('#button_new_game').style.display = 'block';
  document.querySelector('#button_new_game').innerHTML = 'PLAY AGAIN';
  const letters = document.querySelectorAll('.letter');
  for (let i = 0; i < letters.length; i++) {
    letters[i].disabled = true;
  }
}

const letters = [
  'A',
  'Ą',
  'B',
  'C',
  'Ć',
  'D',
  'E',
  'Ę',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'Ł',
  'M',
  'N',
  'Ń',
  'O',
  'Ó',
  'P',
  'Q',
  'R',
  'S',
  'Ś',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'Ź',
  'Ż'
];

function create_alphabet() {
  const letters_container = document.querySelector('#alphabet');

  for (let i = 0; i < letters.length; i++) {
    const button = document.createElement('button');

    button.innerHTML = letters[i];
    button.classList.add('letter');
    button.addEventListener('click', letter_click);
    letters_container.appendChild(button);
  }
}
create_alphabet();
