const connection = new WebSocket('ws://localhost:8080');

let changeStatus = document.querySelector('.status');
let activeUser = document.querySelector('.activeUser');
let userName;
const currentDate = () => new Date().toTimeString().split(' ')[0];

function setStatus(value) {
  changeStatus.innerHTML = value;
}

function setUser(value) {
  activeUser.innerHTML = value;
}

connection.onopen = () => {
  userName = prompt('Enter your name');
  if(userName === null || userName === '') {
    userName = 'Unknown user'
  }
  setUser(userName)
  setStatus('ONLINE');
};

connection.onclose = () => {
  setStatus('DISCONECTED');
};

connection.onerror = (error) => {
  setStatus('ERROR');
  console.log(error);
};

connection.onmessage = (event) => {
  console.log('received', event.data);

  event = JSON.parse(event.data);

  document.querySelector('#chat').insertAdjacentHTML(
    'beforeend',
    `
    <li class='nameLi'>${event.userName}</li>
    <li class='messageLi'>${event.message}</li>
    <li class='timeLi'>${currentDate()}</li>
    `
  );
};

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  let message = document.querySelector('#message').value;
  connection.send(JSON.stringify({ message, userName }));

  console.log('send', JSON.stringify({ message, userName }));

  document.querySelector('#chat').insertAdjacentHTML(
    'beforeend',
    `
    <li class='messageLi myMessage'>${message}</li>
    <li class='timeLi myMessage'>${currentDate()}</li>
    `
  );

  document.querySelector('#message').value = '';
});