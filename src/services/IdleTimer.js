export function IdleTimer() {

  let inactivityTime = function () {
    let time;
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.onkeyup = resetTimer;
    document.onkeydown = resetTimer;
    document.onclick = resetTimer;

    function logout() {
      window.location.reload();
    }

    function resetTimer() {
      console.log("Idle timer started...");
      clearTimeout(time);
      time = setTimeout(logout, 30000)
    }
  };
  inactivityTime();
}