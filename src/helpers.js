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


let now = new Date();
let day = ("0" + now.getDate()).slice(-2);
let month = ("0" + (now.getMonth() + 1)).slice(-2);
let today = now.getFullYear() + "-" + (month) + "-" + (day);

let currentTime = (now.getHours() < 10 ? '0' + (now.getHours()) : now.getHours()) + ':' + now.getMinutes();

export { today, currentTime, isIOS }

