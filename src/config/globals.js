export const phase_A_time = '16:30:00';
export const deadline_A = '17:00:00';

export const phase_B_time = '17:15:00';
export const deadline_B = '17:45:00';

export const phase_C_time = '18:00:00';
export const deadline_C = '18:30:00';


export const deadline = '30';

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
