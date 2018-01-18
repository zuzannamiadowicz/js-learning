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
