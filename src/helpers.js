const getMobileOperatingSystem = () => {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }

  return "Desktop";
}

let isIOS = getMobileOperatingSystem() === 'iOS' ? true : false;


// Date, time
let now = new Date();
let day = ("0" + now.getDate()).slice(-2);
let month = ("0" + (now.getMonth() + 1)).slice(-2);
let today = now.getFullYear() + "-" + (month) + "-" + (day);

let currentTime =
  (now.getHours() < 10 ? '0' + (now.getHours()) : now.getHours())
  + ':' +
  (now.getMinutes() < 10 ? '0' + (now.getMinutes()) : now.getMinutes())
  + ':' +
  now.getSeconds();

// Back button
var backPresses = 0;
var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
var maxBackPresses = 2;
function handleBackButton(init) {
  if (init !== true)
    backPresses++;
  if ((!isAndroid && backPresses >= maxBackPresses) || (isAndroid && backPresses >= maxBackPresses - 1)) {
    window.history.back();
  } else
    window.history.pushState({}, '');
}

function setupWindowHistoryTricks() {
  handleBackButton(true);
  window.addEventListener('popstate', handleBackButton);
}
export { today, currentTime, isIOS, setupWindowHistoryTricks }

