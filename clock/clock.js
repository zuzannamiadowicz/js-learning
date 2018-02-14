function count() {
  var today = new Date();
  var day = today.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  var month = today.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  var full_year = today.getFullYear();
  year = full_year % 100;
  var hours = today.getHours();
  if (hours < 10) {
    hours = '0' + hours;
  }
  var minutes = today.getMinutes();
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  var seconds = today.getSeconds();
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  document.getElementById('clock').innerHTML =
    month + '/' + day + '/' + year + ' || ' + hours + ':' + minutes + ':' + seconds;
  setTimeout('count()', 1000);
}

function check_number_from_input() {
  const inputValue = document.getElementById('number_input').value;
  const number = parseInt(inputValue, 10);
  const result_element = document.getElementById('result');

  if (isNaN(number)) {
    result_element.innerHTML = 'NaN';
    result_element.style.color = 'black';
  } else if (number < 0) {
    result_element.innerHTML = 'negative';
    result_element.style.color = 'red';
  } else if (number === 0) {
    result_element.innerHTML = 'zero';
    result_element.style.color = 'blue';
  } else {
    result_element.innerHTML = 'positive';
    result_element.style.color = 'green';
  }
}
function print_numbers() {
  const first_number = document.getElementById('number_one').value;
  const second_number = document.getElementById('number_two').value;
  let f_number = parseInt(first_number, 10);
  let s_number = parseInt(second_number, 10);

  if (isNaN(f_number) || isNaN(s_number)) {
    document.getElementById('printing_result').innerHTML = 'bad data-type';
  } else if (f_number <= s_number) {
    do {
      document.getElementById('printing_result').innerHTML += f_number + ' ';
      f_number += 1;
    } while (f_number <= s_number);
  } else if (f_number > s_number) {
    do {
      document.getElementById('printing_result').innerHTML += f_number + ' ';
      f_number = f_number - 1;
    } while (f_number >= s_number);
  } else {
    document.getElementById('printing_result').innerHTML = 'bad data-type';
  }
}

function clear_field() {
  document.getElementById('printing_result').innerHTML = null;
}
