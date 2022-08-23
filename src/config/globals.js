import { GetApi } from "src/services/Axios";
import { api_server_url } from "./urls";

export let settings = '';

export async function GetSettings() {
  let data = '';
  await GetApi(api_server_url + '/settings')
    .then(function (value) {
      data = value[0];
      settings = data;
    });
  return data;
}

export function GetCurrentPhase() {
  var d = new Date();
  var n = d.toLocaleTimeString('en-US', { hour12: false });

  // Questions card
  if (n >= settings.phaseA_time && n <= settings.phaseA_deadline) {
    return 'A';
  } else if (n >= settings.phaseB_time && n <= settings.phaseB_deadline) {
    return 'B';
  } else if (n >= settings.phaseC_time && n <= settings.phaseC_deadline) {
    return 'C';
  } else {
    return 'N/A';
  }
}

export function GetCurrentDeadline() {
  // Questions card
  if (GetCurrentPhase() === 'A') {
    return settings.phaseA_deadline;
  }
  if (GetCurrentPhase() === 'B') {
    return settings.phaseB_deadline;
  }
  if (GetCurrentPhase() === 'C') {
    return settings.phaseC_deadline;
  } else {
    return 'N/A';
  }
}

export function GetPreviousPhase() {
  var d = new Date();
  var n = d.toLocaleTimeString('en-US', { hour12: false });

  // Questions card
  if (n >= settings.phaseA_deadline && n <= settings.phaseB_time) {
    return 'A';
  }
  if (n >= settings.phaseB_deadline && n <= settings.phaseC_time) {
    return 'B';
  }
  if (n >= settings.phaseC_deadline && n <= settings.phaseA_time) {
    return 'C';
  } else {
    return 'A';
  }

}

export function GetPendingPhase() {
  var d = new Date();
  var n = d.toLocaleTimeString('en-US', { hour12: false });

  if (n >= settings.phaseA_deadline && n <= settings.phaseB_time) {
    return 'B';
  }
  else if (n >= settings.phaseB_deadline && n <= settings.phaseC_time) {
    return 'C';
  }
  else if (n >= settings.phaseC_deadline && n <= settings.phaseA_time) {
    return 'A';
  }
  else {
    return 'A';
  }
}

export function GetPendingPhaseTime() {
  var d = new Date();
  var n = d.toLocaleTimeString('en-US', { hour12: false });

  if (n >= settings.phaseA_deadline && n <= settings.phaseB_time) {
    return settings.phaseB_time;
  }
  else if (n >= settings.phaseB_deadline && n <= settings.phaseC_time) {
    return settings.phaseC_time;
  }
  else if (n >= settings.phaseC_deadline && n <= settings.phaseA_time) {
    return settings.phaseA_time;
  }
  else {
    return settings.phaseA_time;
  }
}