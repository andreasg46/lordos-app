let now = new Date();
let day = ("0" + now.getDate()).slice(-2);
let month = ("0" + (now.getMonth() + 1)).slice(-2);
let today = now.getFullYear() + "-" + (month) + "-" + (day);

let currentTime = (now.getHours() + 1 < 10 ? '0' + (now.getHours()) : now.getHours() + 1) + ':' + now.getMinutes();

export { today, currentTime }