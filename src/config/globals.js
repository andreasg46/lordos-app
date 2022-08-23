import { GetApi } from "src/services/Axios";
import { api_server_url } from "./urls";

export let phase_A_time = "09:00:00";
export let deadline_A = '09:30:00';

export let phase_B_time = '14:00:00';
export let deadline_B = '14:30:00';

export let phase_C_time = '18:00:00';
export let deadline_C = '18:30:00';

export let deadline = '30';

export async function GetSettings() {
  let data = '';
  await GetApi(api_server_url + '/settings')
    .then(function (value) {
      value = value[0];
      phase_A_time = value.phaseA_time;
      phase_B_time = value.phaseB_time;
      phase_C_time = value.phaseC_time;
      deadline_A = value.phaseA_deadline;
      deadline_B = value.phaseB_deadline;
      deadline_C = value.phaseC_deadline;
    });
  return data;
}


export function GetCurrentPhase() {
  var d = new Date();
  var n = d.toLocaleTimeString('en-US', { hour12: false });

  // Questions card
  if (n >= phase_A_time && n <= deadline_A) {
    return 'A';
  } else if (n >= phase_B_time && n <= deadline_B) {
    return 'B';
  } else if (n >= phase_C_time && n <= deadline_C) {
    return 'C';
  } else {
    return 'N/A';
  }
}

export function GetPreviousPhase() {
  var d = new Date();
  var n = d.toLocaleTimeString('en-US', { hour12: false });

  // Home card
  if (n >= phase_A_time && n <= deadline_A) {
    return 'C';
  } else if (n >= phase_B_time && n <= deadline_B) {
    return 'A';
  } else if (n >= phase_C_time && n <= deadline_C) {
    return 'B';
  } else {
    return 'N/A';
  }
}

export function GetPreviousPhaseTime(previousPhase) {
  var d = new Date();
  var n = d.toLocaleTimeString('en-US', { hour12: false });

  // Home card
  if (previousPhase === 'C') {
    return phase_C_time;
  }
  if (previousPhase === 'B') {
    return phase_B_time;
  }
  if (previousPhase === 'A') {
    return phase_A_time;
  }

  return 'N/A';
}

export function GetCurrentDeadline() {
  var d = new Date();
  var n = d.toLocaleTimeString('en-US', { hour12: false });

  // Questions card
  if (n >= phase_A_time && n <= deadline_A) {
    return deadline_A;
  } else if (n >= phase_B_time && n <= deadline_B) {
    return deadline_B;
  } else if (n >= phase_C_time && n <= deadline_C) {
    return deadline_C;
  } else {
    return 'N/A';
  }
}
