
import { settings } from "src/config/globals";
import { api_server_url, app_url } from "src/config/urls";
import { addMinutes, isIOS, today } from "src/helpers";
import { GetApi, PostApi } from "./Axios";

export async function SendWebPushByCode(code, headings, subtitle, campaign, datetime, topic, click_url) {
  let body = {
    code: code,
    headings: headings,
    subtitle: subtitle,
    campaign: campaign,
    datetime: datetime,
    topic: topic,
    click_url: click_url
  }
  await PostApi(api_server_url + '/web-push', body)
    .then(function (value) {
      console.log("Sending Web Push... => ", value);
    });
}

// todo
export async function SendWelcomeSMS(phone, message, datetime, click_url) {
  let body = {
    phone: phone,
    message: message,
    datetime: datetime || null,
    click_url: click_url
  }
  await PostApi(api_server_url + '/sms-start', body)
    .then(function (value) {
      console.log("Sending SMS Push... => ", value);
    });
}

export async function SendSMSByCode(phone, message, datetime, click_url) {
  let body = {
    phone: phone,
    message: message,
    datetime: datetime || null,
    click_url: click_url
  }
  await PostApi(api_server_url + '/sms-push', body)
    .then(function (value) {
      console.log("Sending SMS Push... => ", value);
    });
}

export async function AddTags(userId, session_id, code) {
  const options = {
    method: 'PUT',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: `${process.env.REACT_APP_ONE_SIGNAL_APP_ID}`,
      external_user_id: code,
      tags: {
        session_id: session_id,
      }
    })
  };

  fetch('https://onesignal.com/api/v1/players/' + userId, options)
    .then(response => response.json())
    .then(response => console.log('Updating player id... => ', response.success))
    .catch(err => console.error(err));
}

export async function GetDevices() {
  let data = '';
  await GetApi(api_server_url + '/devices')
    .then(function (value) {
      data = value.body.players;
    });
  return data;
}

export async function AddDevice(phone, code, session_id) {
  const response = await PostApi(api_server_url + '/device', { phone, code, session_id })
    .then(value => value)

  return { response };
}

export function StartCampaign(code, phone) {

  //console.log("campaign will start");
  // Start Push Server Campaign
  const headings = 'Knock Knock!'
  const subtitle = 'Questions are now available!';
  const campaign = 'Default Campaign';
  const topic = 'Default Topic';
  const datetime = new Date();
  const clickUrl = app_url.concat('/');

  const messageContent = 'Questions are now available!';
  const reminderContent = 'Have you completed your task? If not do it now!';

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);


  const total_days = 7; // total campaign days
  tomorrow.setDate(tomorrow.getDate());

  //Welcome Message
  // if (isIOS) {
  SendWelcomeSMS(phone, 'Welcome to Family Moments Experience!', null, app_url);
  // } else {
  //   SendWebPushByCode(code, headings, "Welcome to Family Moments Experience!", campaign, datetime, topic, app_url);
  // }

  var d = new Date();
  var n = d.toLocaleTimeString('en-US', { hour12: false });
  var reminderTime = (settings.deadline) / 2;

  for (let i = 0; i < total_days; i++) {
    const [next] = tomorrow.toISOString().split('T');
    // let phaseA_meritTime = addMinutes(15, new Date(next + 'T' + settings.phaseA_time));
    // let phaseB_meritTime = addMinutes(15, new Date(next + 'T' + settings.phaseB_time));
    // let phaseC_meritTime = addMinutes(15, new Date(next + 'T' + settings.phaseC_time));

    let phaseA_meritTime = addMinutes(reminderTime, new Date(next + 'T' + settings.phaseA_time));
    let phaseB_meritTime = addMinutes(reminderTime, new Date(next + 'T' + settings.phaseB_time));
    let phaseC_meritTime = addMinutes(reminderTime, new Date(next + 'T' + settings.phaseC_time));

    //if (isIOS) {
    SendSMSByCode(phone, messageContent, new Date(next + 'T' + settings.phaseA_time), clickUrl); // Phase A Campaign
    SendSMSByCode(phone, reminderContent, phaseA_meritTime, clickUrl); // Phase A Campaign Merit Time

    SendSMSByCode(phone, messageContent, new Date(next + 'T' + settings.phaseB_time), clickUrl); // Phase B Campaign
    SendSMSByCode(phone, reminderContent, phaseB_meritTime, clickUrl); // Phase B Campaign Merit Time

    SendSMSByCode(phone, messageContent, new Date(next + 'T' + settings.phaseC_time), clickUrl); // Phase C Campaign
    SendSMSByCode(phone, reminderContent, phaseC_meritTime, clickUrl); // Phase C Campaign Merit Time

    // } else {
    //   SendWebPushByCode(code, headings, messageContent, campaign, new Date(next + 'T' + settings.phaseA_time), topic, clickUrl); // Phase A Campaign
    //   SendWebPushByCode(code, headings, reminderContent, campaign, phaseA_meritTime, topic, clickUrl); // Phase A Campaign Merit Time

    //   SendWebPushByCode(code, headings, messageContent, campaign, new Date(next + 'T' + settings.phaseB_time), topic, clickUrl); // Phase B Campaign
    //   SendWebPushByCode(code, headings, reminderContent, campaign, phaseB_meritTime, topic, clickUrl); // Phase B Campaign Merit Time

    //   SendWebPushByCode(code, headings, messageContent, campaign, new Date(next + 'T' + settings.phaseC_time), topic, clickUrl); // Phase C Campaign
    //   SendWebPushByCode(code, headings, reminderContent, campaign, phaseC_meritTime, topic, clickUrl); // Phase C Campaign Merit Time

    // }
    tomorrow.setDate(tomorrow.getDate() + 1)
  }
}
