let available_letters = []; //user's letters
let word_letters = []; //before confirmation
let all_points = 0;

function create_board() {
  const board = document.querySelector('#board');
  board.addEventListener('click', put_letter);

  for (let i = 0; i < board_boxes.length; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < board_boxes[i].length; j++) {
      const box = document.createElement('div');
      box.innerHTML = board_boxes[i][j];
      box.classList.add('box');
      box.setAttribute('box-x', i);
      box.setAttribute('box-y', j);
      if (board_boxes[i][j] != '') {
        box.classList.add(board_boxes[i][j]);
      }
      row.appendChild(box);
    }
    board.appendChild(row);
  }
}

function create_letters() {
  if (letters.length > 0) {
    do {
      let letter_index = [Math.floor(Math.random() * letters.length)];
      available_letters.push(letters[letter_index]);
      create_letter(letters[letter_index]);

      letters.splice(letter_index, 1);
    } while (available_letters.length < 7);
  }
}

function create_letter(letter) {
  const letters_container = document.querySelector('#letters');

  const letter_container = document.createElement('div');
  letter_container.classList.add('letter');
  letter_container.setAttribute('letter', letter.letter);
  letter_container.setAttribute('value', letter.value);

  letter_container.innerHTML = letter.letter;
  const value = document.createElement('div');
  value.innerHTML = letter.value;
  value.classList.add('value');

  letter_container.appendChild(value);
  letter_container.addEventListener('click', select_letter);
  letters_container.appendChild(letter_container);
}

let selected_letter;
let selected_letter_element;

function select_letter(event) {
  console.log(event.currentTarget, event.target);
  const letter = event.currentTarget.getAttribute('letter');
  const value = parseInt(event.currentTarget.getAttribute('value'));

  selected_letter = { letter: letter, value: value };

  event.currentTarget.classList.add('selected');
  selected_letter_element = event.currentTarget;
}

function put_letter(event) {
  if (selected_letter !== null && !event.target.classList.contains('occupied')) {
    const box_x = parseInt(event.target.getAttribute('box-x'));
    const box_y = parseInt(event.target.getAttribute('box-y'));
    event.target.innerHTML = selected_letter.letter;
    event.target.classList.add('occupied');
    word_letters.push({ letter: selected_letter, x: box_x, y: box_y });

    const available_letter_index = available_letters.findIndex(function(letter) {
      return letter.letter === select_letter.letter;
    });
    available_letters.splice(available_letter_index, 1);
    display_word_points();

    selected_letter = null;
    selected_letter_element.remove();
  }
}

function letter_undo() {
  const last_letter = word_letters.pop();
  let board_box = document.querySelector(`.row:nth-child(${last_letter.x + 1}) .box:nth-child(${last_letter.y + 1})`);
  board_box.classList.remove('occupied');
  board_box.innerHTML = board_boxes[last_letter.x][last_letter.y];
  display_word_points();
  available_letters.push(last_letter);
  create_letter(last_letter.letter, available_letters.length - 1);
}

function is_first_word_on_start() {
  for (let i = 0; i < word_letters.length; i++) {
    if (word_letters[i].y === 7 && word_letters[i].x === 7) {
      return true;
    }
  }
  return false;
}

function get_word_direction() {
  let y = 0;
  let x = 0;

  let fist_lettter = word_letters[0];
  for (let i = 1; i < word_letters.length; i++) {
    if (fist_lettter.y === word_letters[i].y) {
      y += 1;
    }
    if (fist_lettter.x === word_letters[i].x) {
      x += 1;
    }
  }
  if (y === word_letters.length - 1) {
    return 'column';
  }
  if (x === word_letters.length - 1) {
    return 'row';
  }

  return undefined;
}

function are_ascending_by_one(coordinates) {
  for (let i = 1; i < coordinates.length; i++) {
    if (coordinates[i] - coordinates[i - 1] > 1) {
      return false;
    }
  }
  return true;
}

function compare_by_x(letter0, letter1) {
  if (letter0.x < letter1.x) {
    return -1;
  } else if (letter0.x === letter1.x) {
    return 0;
  } else {
    return 1;
  }
}

function compare_by_y(letter0, letter1) {
  if (letter0.y < letter1.y) {
    return -1;
  } else if (letter0.x === letter1.x) {
    return 0;
  } else {
    return 1;
  }
}

function check_word_order(word_direction) {
  if (word_direction === 'column') {
    const sorted_letters = word_letters.sort(compare_by_x);

    let x_coordinates = [];
    for (let i = 0; i < sorted_letters.length; i++) {
      x_coordinates.push(sorted_letters[i].x);
    }

    return are_ascending_by_one(x_coordinates);
  } else {
    const sorted_letters = word_letters.sort(compare_by_y);
    let y_coordinates = [];
    for (let i = 0; i < sorted_letters.length; i++) {
      y_coordinates.push(sorted_letters[i].y);
    }
    return are_ascending_by_one(y_coordinates);
  }
}

function points_counting() {
  let word_points = 0;
  let Wx2 = false;
  let Wx3 = false;

  for (let i = 0; i < word_letters.length; i++) {
    let letter = word_letters[i];
    let x = letter.x;
    let y = letter.y;
    let value = letter.letter.value;

    if (board_boxes[x][y] === 'Lx2') {
      word_points += value * 2;
    } else if (board_boxes[x][y] === 'Lx3') {
      word_points += value * 3;
    } else if (board_boxes[x][y] === '' || board_boxes[x][y] === 'START') {
      word_points += value;
    } else if (board_boxes[x][y] === 'Wx2') {
      word_points += value;
      Wx2 = true;
    } else if (board_boxes[x][y] === 'Wx3') {
      word_points += value;
      Wx3 = true;
    }
  }
  if (Wx2 === true) {
    word_points = word_points * 2;
  } else if (Wx3 === true) {
    word_points = word_points * 3;
  }
  return word_points;
}

function display_word_points() {
  document.querySelector('#letter_score').innerHTML = points_counting();
}

let word_counter = 0;

function confirmation() {
  if (word_counter === 0 && !is_first_word_on_start()) {
    alert('First word has to be on start');
    return;
  }
  let word_direction = get_word_direction();
  if (word_direction === undefined) {
    alert('Word has to be in one row or column');
    return;
  }
  let is_correct = check_word_order(word_direction);
  if (is_correct) {
    all_points += points_counting();
    document.querySelector('#score').innerHTML = all_points;
    word_letters.splice(0, word_letters.length);
    word_counter += 1;
    document.querySelector('#letter_score').innerHTML = 0;
    create_letters();
    word_letters.splice(0, word_letters.length);
  } else {
    alert('no spaces between the letters!');
    return;
  }
}

let letters = [
  { letter: 'A', value: 1 },
  { letter: 'A', value: 1 },
  { letter: 'A', value: 1 },
  { letter: 'A', value: 1 },
  { letter: 'A', value: 1 },
  { letter: 'A', value: 1 },
  { letter: 'A', value: 1 },
  { letter: 'A', value: 1 },
  { letter: 'A', value: 1 },
  { letter: 'Ą', value: 5 },
  { letter: 'E', value: 1 },
  { letter: 'E', value: 1 },
  { letter: 'E', value: 1 },
  { letter: 'E', value: 1 },
  { letter: 'E', value: 1 },
  { letter: 'E', value: 1 },
  { letter: 'E', value: 1 },
  { letter: 'E', value: 1 },
  { letter: 'Ę', value: 5 },
  { letter: 'I', value: 1 },
  { letter: 'I', value: 1 },
  { letter: 'I', value: 1 },
  { letter: 'I', value: 1 },
  { letter: 'I', value: 1 },
  { letter: 'I', value: 1 },
  { letter: 'I', value: 1 },
  { letter: 'I', value: 1 },
  { letter: 'N', value: 1 },
  { letter: 'N', value: 1 },
  { letter: 'N', value: 1 },
  { letter: 'N', value: 1 },
  { letter: 'N', value: 1 },
  { letter: 'O', value: 1 },
  { letter: 'O', value: 1 },
  { letter: 'O', value: 1 },
  { letter: 'O', value: 1 },
  { letter: 'O', value: 1 },
  { letter: 'O', value: 1 },
  { letter: 'R', value: 1 },
  { letter: 'R', value: 1 },
  { letter: 'R', value: 1 },
  { letter: 'R', value: 1 },
  { letter: 'S', value: 1 },
  { letter: 'S', value: 1 },
  { letter: 'S', value: 1 },
  { letter: 'S', value: 1 },
  { letter: 'W', value: 1 },
  { letter: 'W', value: 1 },
  { letter: 'W', value: 1 },
  { letter: 'W', value: 1 },
  { letter: 'Z', value: 1 },
  { letter: 'Z', value: 1 },
  { letter: 'Z', value: 1 },
  { letter: 'Z', value: 1 },
  { letter: 'Z', value: 1 },
  { letter: 'C', value: 2 },
  { letter: 'C', value: 2 },
  { letter: 'C', value: 2 },
  { letter: 'D', value: 2 },
  { letter: 'D', value: 2 },
  { letter: 'D', value: 2 },
  { letter: 'K', value: 2 },
  { letter: 'K', value: 2 },
  { letter: 'K', value: 2 },
  { letter: 'L', value: 2 },
  { letter: 'L', value: 2 },
  { letter: 'L', value: 2 },
  { letter: 'M', value: 2 },
  { letter: 'M', value: 2 },
  { letter: 'M', value: 2 },
  { letter: 'P', value: 2 },
  { letter: 'P', value: 2 },
  { letter: 'P', value: 2 },
  { letter: 'T', value: 2 },
  { letter: 'T', value: 2 },
  { letter: 'T', value: 2 },
  { letter: 'Y', value: 2 },
  { letter: 'Y', value: 2 },
  { letter: 'Y', value: 2 },
  { letter: 'Y', value: 2 },
  { letter: 'B', value: 3 },
  { letter: 'B', value: 3 },
  { letter: 'G', value: 3 },
  { letter: 'G', value: 3 },
  { letter: 'H', value: 3 },
  { letter: 'H', value: 3 },
  { letter: 'J', value: 3 },
  { letter: 'J', value: 3 },
  { letter: 'Ł', value: 3 },
  { letter: 'Ł', value: 3 },
  { letter: 'U', value: 3 },
  { letter: 'U', value: 3 },
  { letter: 'F', value: 5 },
  { letter: 'Ó', value: 5 },
  { letter: 'Ś', value: 5 },
  { letter: 'Ż', value: 5 },
  { letter: 'Ć', value: 6 },
  { letter: 'Ń', value: 7 },
  { letter: 'Ź', value: 9 }
];

let board_boxes = [
  ['Wx3', '', '', 'Lx2', '', '', '', 'Wx3', '', '', '', 'Lx2', '', '', 'Wx3'],
  ['', 'Wx2', '', '', '', 'Lx3', '', '', '', 'Lx3', '', '', '', 'Wx2', ''],
  ['', '', 'Wx2', '', '', '', 'Lx2', '', 'Lx2', '', '', '', 'Wx2', '', ''],
  ['Lx2', '', '', 'Wx2', '', '', '', 'Lx3', '', '', '', 'Wx2', '', '', 'Lx2'],
  ['', '', '', '', 'Wx2', '', '', '', '', '', 'Wx2', '', '', '', ''],
  ['', 'Lx3', '', '', '', 'Lx3', '', '', '', 'Lx3', '', '', '', 'Lx3', ''],
  ['', '', 'Lx2', '', '', '', 'Lx2', '', 'Lx2', '', '', '', 'Lx2', '', ''],
  ['Wx3', '', '', 'Lx2', '', '', '', 'START', '', '', '', 'Lx2', '', '', 'Wx3'],
  ['', '', 'Lx2', '', '', '', 'Lx2', '', 'Lx2', '', '', '', 'Lx2', '', ''],
  ['', 'Lx3', '', '', '', 'Lx3', '', '', '', 'Lx3', '', '', '', 'Lx3', ''],
  ['', '', '', '', 'Wx2', '', '', '', '', '', 'Wx2', '', '', '', ''],
  ['Lx2', '', '', 'Wx2', '', '', '', 'Lx3', '', '', '', 'Wx2', '', '', 'Lx2'],
  ['', '', 'Wx2', '', '', '', 'Lx2', '', 'Lx2', '', '', '', 'Wx2', '', ''],
  ['', 'Wx2', '', '', '', 'Lx3', '', '', '', 'Lx3', '', '', '', 'Wx2', ''],
  ['Wx3', '', '', 'Lx2', '', '', '', 'Wx3', '', '', '', 'Lx2', '', '', 'Wx3']
];

create_board();
create_letters();
