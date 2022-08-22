import { phase_A_time, phase_B_time, phase_C_time } from "src/config/globals";
import { api_server_url, app_url } from "src/config/urls";
import { isIOS, today } from "src/helpers";
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
      console.log("Sending Web Push...");
      console.log(value);
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
      console.log("Sending SMS Push...");
      console.log(value);
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
    .then(response => console.log(response))
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
  // Start Push Server Campaign
  const headings = 'Knock Knock!'
  const subtitle = 'Questions are now available!';
  const campaign = 'Default Campaign';
  const topic = 'Default Topic';
  const datetime = new Date();
  const clickUrl = app_url.concat('/');

  const smsContent = 'Questions available!';

  const tomorrow = new Date(today);
  // tomorrow.setDate(tomorrow.getDate() + 1);


  const total_days = 1;
  tomorrow.setDate(tomorrow.getDate());


  //Welcome Message
  if (isIOS) {
    SendSMSByCode(phone, 'Welcome to Lordos App!', null, app_url);
  } else {
    SendWebPushByCode(code, headings, "Welcome to Lordos App!", campaign, datetime, topic, app_url);
  }

  for (let i = 0; i < total_days; i++) {
    const [next] = tomorrow.toISOString().split('T');

    if (isIOS) {
      SendSMSByCode(phone, smsContent, new Date(next + 'T' + phase_A_time), clickUrl); // Phase A Campaign
      SendSMSByCode(phone, smsContent, new Date(next + 'T' + phase_B_time), clickUrl); // Phase B Campaign
      SendSMSByCode(phone, smsContent, new Date(next + 'T' + phase_C_time), clickUrl); // Phase C Campaign
    } else {
      SendWebPushByCode(code, headings, subtitle, campaign, new Date(next + 'T' + phase_A_time), topic, clickUrl); // Phase A Campaign
      SendWebPushByCode(code, headings, subtitle, campaign, new Date(next + 'T' + phase_B_time), topic, clickUrl); // Phase B Campaign
      SendWebPushByCode(code, headings, subtitle, campaign, new Date(next + 'T' + phase_C_time), topic, clickUrl); // Phase C Campaign
    }
    tomorrow.setDate(tomorrow.getDate() + 1)
  }
}

