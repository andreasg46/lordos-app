// Cookies functions
export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function setCookieByHours(cname, cvalue, exhours) {
  const d = new Date();
  d.setTime(d.getTime() + (exhours * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function setCookieByMinutes(cname, cvalue, exminutes) {
  const d = new Date();
  d.setTime(d.getTime() + (exminutes * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function resetCookies() {
  setCookie('session_id', '', 7);
  setCookie('code', '', 7);
  setCookie('role', '', 7);
  setCookie('status', '', 7);
  setCookie('is_admin', '', 7);
}