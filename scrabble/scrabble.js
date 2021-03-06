//pas
//wymiana liter
//koniec gry
//wymiana liter

let available_letters = []; //user's letters
let word_letters = []; //before confirm
let all_points = 0;
let letters_on_board = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []];

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
      box.setAttribute('box-x', j);
      box.setAttribute('box-y', i);
      if (board_boxes[i][j] != '') {
        box.classList.add(board_boxes[i][j]);
      }
      row.appendChild(box);
    }
    board.appendChild(row);
  }
}

function create_letters() {
  if (available_letters.length === 0 && letters.length === 0) {
    game_over();
  }
  while (available_letters.length < 7 && letters.length > 0) {
    let letter_index = [Math.floor(Math.random() * letters.length)];
    available_letters.push(letters[letter_index]);
    create_letter(letters[letter_index]);

    letters.splice(letter_index, 1);
  }
}

function start_game() {
  window.location.reload();
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

let selected_letter = null;
let selected_letter_element;

function select_letter(event) {
  if (selected_letter_element !== undefined) {
    selected_letter_element.classList.remove('selected');
  }
  const letter = event.currentTarget.getAttribute('letter');
  const value = parseInt(event.currentTarget.getAttribute('value'));

  selected_letter = { letter: letter, value: value };
  event.currentTarget.classList.add('selected');
  selected_letter_element = event.currentTarget;
}

function put_letter(event) {
  if (!!selected_letter && !event.target.classList.contains('occupied')) {
    const box_x = parseInt(event.target.getAttribute('box-x'));
    const box_y = parseInt(event.target.getAttribute('box-y'));

    event.target.innerHTML = selected_letter.letter;
    event.target.classList.add('occupied');
    word_letters.push({ letter: selected_letter, x: box_x, y: box_y });

    const available_letter_index = available_letters.findIndex(function(letter) {
      return letter.letter === select_letter.letter;
    });
    available_letters.splice(available_letter_index, 1);
    let all_word = combine_word_with_letters_on_board();
    display_word_points(all_word, word_letters);
    selected_letter = null;
    selected_letter_element.remove();
    document.querySelector('#undo').disabled = false;
  }
}

function letter_undo() {
  if (word_letters.length >= 1) {
    const last_letter = word_letters.pop();
    let board_box = document.querySelector(`.row:nth-child(${last_letter.y + 1}) .box:nth-child(${last_letter.x + 1})`);
    board_box.classList.remove('occupied');
    board_box.innerHTML = board_boxes[last_letter.y][last_letter.x];
    let all_word = combine_word_with_letters_on_board();

    display_word_points(all_word, word_letters);
    available_letters.push(last_letter);
    create_letter(last_letter.letter, available_letters.length - 1);
    if (word_letters.length === 0) {
      document.querySelector('#undo').disabled = true;
    }
  }
}

function is_first_word_on_start() {
  for (let letter of word_letters) {
    if (letter.y === 7 && letter.x === 7) {
      return true;
    }
  }
  return false;
}

function get_word_direction() {
  let y = 0;
  let x = 0;
  let first_lettter = word_letters[0];

  if (word_counter > 0 && word_letters.length === 1) {
    if (first_lettter.x === 0) {
      if (letters_on_board[first_lettter.y][first_lettter.x + 1] !== undefined) {
        return 'row';
      }
    } else if (first_lettter.x === 14) {
      if (letters_on_board[first_lettter.y][first_lettter.x - 1] !== undefined) {
        return 'row';
      }
    } else if (
      letters_on_board[first_lettter.y][first_lettter.x - 1] !== undefined ||
      letters_on_board[first_lettter.y][first_lettter.x + 1] !== undefined
    ) {
      return 'row';
    } else {
      return 'column';
    }
  }

  for (let i = 1; i < word_letters.length; i++) {
    if (first_lettter.y === word_letters[i].y) {
      y += 1;
    }
    if (first_lettter.x === word_letters[i].x) {
      x += 1;
    }
  }
  if (x === word_letters.length - 1) {
    return 'column';
  }
  if (y === word_letters.length - 1) {
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
  } else if (letter0.y === letter1.y) {
    return 0;
  } else {
    return 1;
  }
}

function check_word_order(word_direction, word) {
  if (word_direction === 'row') {
    const sorted_letters = word.sort(compare_by_x);
    let x_coordinates = [];
    for (let letter of sorted_letters) {
      x_coordinates.push(letter.x);
    }
    return are_ascending_by_one(x_coordinates);
  } else {
    const sorted_letters = word.sort(compare_by_y);
    let y_coordinates = [];
    for (let letter of sorted_letters) {
      y_coordinates.push(letter.y);
    }
    return are_ascending_by_one(y_coordinates);
  }
}

function calc_points_for_word(word, word_letters) {
  let word_points = 0;
  let Wx2 = false;
  let Wx3 = false;

  let no_extra_points_letters = letters_without_extra_points(word);

  for (let letter of word_letters) {
    let x = letter.x;
    let y = letter.y;
    let value = letter.letter.value;

    if (board_boxes[y][x] === 'Lx2') {
      word_points += value * 2;
    } else if (board_boxes[y][x] === 'Lx3') {
      word_points += value * 3;
    } else if (board_boxes[y][x] === '' || board_boxes[y][x] === 'x') {
      word_points += value;
    } else if (board_boxes[y][x] === 'Wx2') {
      word_points += value;
      Wx2 = true;
    } else if (board_boxes[y][x] === 'Wx3') {
      word_points += value;
      Wx3 = true;
    }
  }

  for (let letter of no_extra_points_letters) {
    word_points += letter.letter.value;
  }

  if (Wx2 === true) {
    word_points = word_points * 2;
  } else if (Wx3 === true) {
    word_points = word_points * 3;
  }
  return word_points;
}

function letters_without_extra_points(word) {
  let no_extra_points = [];
  for (let letter of word) {
    let counter = 0;
    for (let element of word_letters) {
      if (letter !== element) {
        counter += 1;
      }
    }
    if (counter === word_letters.length) {
      no_extra_points.push(letter);
    }
  }
  return no_extra_points;
}

function points_counting(word, word_letters) {
  let sides_words = check_sides_words();
  let result = 0;
  result += count_points_from_side_words(sides_words);
  result += calc_points_for_word(word, word_letters);

  return result;
}

function display_word_points(word, word_letters) {
  document.querySelector('#letter_score').innerHTML = points_counting(word, word_letters);
}

function display_all_points() {
  document.querySelector('#score').innerHTML = all_points;
}

function put_word_letters_to_board_letters() {
  for (let letter of word_letters) {
    letters_on_board[letter.y][letter.x] = letter;
  }
}

function combine_word_with_letters_on_board() {
  let direction = get_word_direction();
  let board_letters = [];
  let board_and_word_letters = [];
  let sorted_letters = [];

  if (direction === 'column') {
    for (let row of letters_on_board) {
      board_letters.push(row[word_letters[0].x]);
    }

    sorted_letters = word_letters.sort(compare_by_y);

    let first_y = sorted_letters[0].y;
    let last_y = sorted_letters[sorted_letters.length - 1].y;

    complete_word('y', first_y, last_y);
  } else if (direction === 'row') {
    board_letters = letters_on_board[word_letters[0].y];
    sorted_letters = word_letters.sort(compare_by_x);

    let first_x = sorted_letters[0].x;
    let last_x = sorted_letters[sorted_letters.length - 1].x;

    complete_word('x', first_x, last_x);
  } else {
    return [];
  }

  function complete_word(coordinate, first, last) {
    let letters_up = first;
    let letters_down = last;

    for (let i = 0; i < sorted_letters.length - 1; i++) {
      board_and_word_letters.push(sorted_letters[i]);

      if (sorted_letters[i + 1][coordinate] - sorted_letters[i][coordinate] > 1) {
        for (let j = sorted_letters[i][coordinate] + 1; j < sorted_letters[i + 1][coordinate]; j++) {
          if (board_letters[j] !== undefined) {
            board_and_word_letters.push(board_letters[j]);
          }
        }
      }
    }
    board_and_word_letters.push(sorted_letters[sorted_letters.length - 1]);

    while (board_letters[letters_up - 1] !== undefined) {
      board_and_word_letters.push(board_letters[letters_up - 1]);
      letters_up = letters_up - 1;
    }

    while (board_letters[letters_down + 1] !== undefined) {
      board_and_word_letters.push(board_letters[letters_down + 1]);
      letters_down = letters_down + 1;
    }
  }

  return board_and_word_letters;
}

function check_sides_words() {
  let sides_words = [];
  let direction = get_word_direction();

  if (direction === 'column') {
    for (let letter of word_letters) {
      let word = [];

      if (letter.x === 14) {
        if (letters_on_board[letter.y][letter.x - 1] !== undefined) {
          const y = letter.y;
          let x = letter.x - 1;
          while (x >= 0 && letters_on_board[y][x] !== undefined) {
            word.push(letters_on_board[y][x]);
            x -= 1;
          }
          word.push(letter);
          word = word.sort(compare_by_x);
          sides_words.push(word);
        }
      } else if (letter.x === 0) {
        if (letters_on_board[letter.y][letter.x + 1] !== undefined) {
          const y = letter.y;
          let x = letter.x + 1;
          while (x <= 14 && letters_on_board[y][x] !== undefined) {
            word.push(letters_on_board[y][x]);
            x += 1;
          }
          word.push(letter);
          word = word.sort(compare_by_x);
          sides_words.push(word);
        }
      } else if (
        letters_on_board[letter.y][letter.x - 1] !== undefined ||
        letters_on_board[letter.y][letter.x + 1] !== undefined
      ) {
        const y = letter.y;

        let x = letter.x - 1;
        while (x >= 0 && letters_on_board[y][x] !== undefined) {
          word.push(letters_on_board[y][x]);
          x -= 1;
        }

        x = letter.x + 1;
        while (x <= 14 && letters_on_board[y][x] !== undefined) {
          word.push(letters_on_board[y][x]);
          x += 1;
        }
        word.push(letter);
        word = word.sort(compare_by_x);
        sides_words.push(word);
      }
    }
  }

  if (direction === 'row') {
    for (let letter of word_letters) {
      let word = [];

      if (letter.y === 14) {
        if (letters_on_board[letter.y - 1][letter.x] !== undefined) {
          const x = letter.x;
          let y = letter.y - 1;
          while (y >= 0 && letters_on_board[y][x] !== undefined) {
            word.push(letters_on_board[y][x]);
            y -= 1;
          }
          word.push(letter);
          word = word.sort(compare_by_y);
          sides_words.push(word);
        }
      } else if (letter.y === 0) {
        if (letters_on_board[letter.y + 1][letter.x] !== undefined) {
          const x = letter.x;
          let y = letter.y + 1;
          while (y <= 14 && letters_on_board[y][x] !== undefined) {
            word.push(letters_on_board[y][x]);
            y += 1;
          }
          word.push(letter);
          word = word.sort(compare_by_y);
          sides_words.push(word);
        }
      } else if (
        letters_on_board[letter.y - 1][letter.x] !== undefined ||
        letters_on_board[letter.y + 1][letter.x] !== undefined
      ) {
        const x = letter.x;

        let y = letter.y - 1;
        while (y >= 0 && letters_on_board[y][x] !== undefined) {
          word.push(letters_on_board[y][x]);
          y -= 1;
        }

        y = letter.y + 1;
        while (y <= 14 && letters_on_board[y][x] !== undefined) {
          word.push(letters_on_board[y][x]);
          y += 1;
        }
        word.push(letter);
        word = word.sort(compare_by_y);
        sides_words.push(word);
      }
    }
  }
  return sides_words;
}

function count_points_from_side_words(sides_words) {
  let points = 0;

  for (let word of sides_words) {
    let word_letters_from_side_word = [];

    for (let letter of word) {
      for (let element of word_letters) {
        if (letter === element) {
          word_letters_from_side_word.push(letter);
        }
      }
    }
    points += calc_points_for_word(word, word_letters_from_side_word);
  }
  return points;
}

let word_counter = 0;

function confirm() {
  if (word_counter === 0 && !is_first_word_on_start()) {
    alert('First word has to be on start');
    return;
  }

  let word_direction = get_word_direction();
  if (word_direction === undefined) {
    alert('Word has to be in one row or column');
    return;
  }
  let complete_word = combine_word_with_letters_on_board();
  let sides_words = check_sides_words();
  if (complete_word.length === word_letters.length && sides_words.length === 0 && word_counter > 0) {
    alert('The word must abut letters on the board');
    return;
  }

  let is_correct = check_word_order(word_direction, complete_word);
  if (is_correct) {
    all_points += points_counting(complete_word, word_letters);
    display_all_points();

    put_word_letters_to_board_letters();
    word_letters = [];
    word_counter += 1;
    document.querySelector('#letter_score').innerHTML = 0;
    create_letters();
  } else {
    alert('no spaces between the letters!');
    return;
  }
  document.querySelector('#undo').disabled = true;
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
  ['Wx3', '', '', 'Lx2', '', '', '', 'x', '', '', '', 'Lx2', '', '', 'Wx3'],
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

let timeinterval = 0;
let time_end;
let total;
time_countdown(1);

function time_countdown(minutes) {
  const time_in_minutes = minutes;
  const current_time = Date.parse(new Date());
  time_end = new Date(current_time + time_in_minutes * 60 * 1000);

  function update_clock() {
    let time = time_remaining(time_end);
    document.querySelector('#clock').innerHTML = time.minutes + ':' + time.seconds;
    if (time.total <= 0) {
      clearInterval(timeinterval);
      game_over();
    }
  }
  timeinterval = setInterval(update_clock, 1000);
}

function time_remaining(time_end) {
  total = time_end - Date.parse(new Date());
  let seconds = Math.floor((total / 1000) % 60);
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  let minutes = Math.floor((total / 1000 / 60) % 60);
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  return { total: total, minutes: minutes, seconds: seconds };
}

function pause_timer() {
  clearInterval(timeinterval);
}

let pause = false;

function pause_game() {
  if (pause === false) {
    document.querySelector('#pause').innerHTML = '⏏︎';
    document.querySelector('#pause').style.height = '30px';
    document.querySelector('#pause').style.width = '30px';
    document.querySelector('#pause').style.transform = 'rotate(90deg)';
    pause_timer();
    document.querySelector('#board').classList.add('blur');
    document.querySelector('#letters').classList.add('blur');
    // document.querySelector('#letters').disabled = true;
    pause = true;
  } else {
    document.querySelector('#pause').innerHTML = 'pause';
    document.querySelector('#pause').style.width = '70px';
    document.querySelector('#pause').style.transform = 'none';
    time_countdown(total / 1000 / 60);
    document.querySelector('#board').classList.remove('blur');
    document.querySelector('#letters').classList.remove('blur');
    // document.querySelector('#letters').disabled = false;
    pause = false;
  }
}

function pass() {
  game_over();
}

function letter_exchange() {
  if (selected_letter === null) {
    alert('please, mark letter to exchange');
  } else {
    const available_letter_index = available_letters.findIndex(function(letter) {
      return letter.letter === select_letter.letter;
    });
    available_letters.splice(available_letter_index, 1);
    setTimeout(create_letters, 1000);
    letters.push(selected_letter);
    selected_letter = null;
    selected_letter_element.remove();
  }
}

function game_over() {
  document.querySelector('#game_space').classList.add('blur');
  document.querySelector('#game_over').style.display = 'flex';
  const elm = document.createElement('div');
  elm.innerHTML = 'Game over' + '<br>' + 'Your points: ' + all_points;

  document.querySelector('#game_over').appendChild(elm);
}
