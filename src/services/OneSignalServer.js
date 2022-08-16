import { api_server_url } from "src/config/urls";
import { today } from "src/helpers";
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

export async function SendSMSByCode(code, subtitle, datetime, click_url) {
  let body = {
    code: code,
    subtitle: subtitle,
    datetime: datetime,
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

export async function AddDevice(device_type, identifier, session_id, external_user_id) {
  const response = await PostApi(api_server_url + '/device', { device_type, identifier, session_id, external_user_id })
    .then(value => value)

  return { response };
}

export function StartCampaign(code) {
  // Start Push Server Campaign
  const headings = 'Knock Knock!'
  const subtitle = 'Questions are now available!';
  const campaign = 'Default Campaign';
  const topic = 'Default Topic';
  const datetime = new Date();
  const clickUrl = app_url.concat('/#/questions');

  const smsContent = 'Questions available!';

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const total_days = 1;
  const deliveryTimeA = '12:40';
  const deliveryTimeB = '12:35';
  const deliveryTimeC = '12:40';

  //Welcome Message
  if (isIOS) {
    SendSMSByCode(code, 'Welcome to Lordos App!', new Date(), app_url);
  } else {
    SendWebPushByCode(code, headings, "Welcome to Lordos App!", campaign, datetime, topic, app_url);
  }

  // for (let i = 0; i < total_days; i++) {
  //   const [next] = tomorrow.toISOString().split('T');


  //   if (isIOS) {
  //     SendSMSByCode(codeS, smsContent, new Date(next + ', ' + deliveryTimeA), clickUrl.concat('?phase=').concat('A')); // Phase A Campaign
  //     SendSMSByCode(codeS, smsContent, new Date(next + ', ' + deliveryTimeB), clickUrl.concat('?phase=').concat('B')); // Phase B Campaign
  //     SendSMSByCode(codeS, smsContent, new Date(next + ', ' + deliveryTimeC), clickUrl.concat('?phase=').concat('C')); // Phase C Campaign
  //   } else {
  //     SendWebPushByCode(codeS, headings, subtitle, campaign, new Date(next + ', ' + deliveryTimeA), topic, clickUrl.concat('?phase=').concat('A')); // Phase A Campaign
  //     SendWebPushByCode(codeS, headings, subtitle, campaign, new Date(next + ', ' + deliveryTimeB), topic, clickUrl.concat('?phase=').concat('B')); // Phase B Campaign
  //     SendWebPushByCode(codeS, headings, subtitle, campaign, new Date(next + ', ' + deliveryTimeC), topic, clickUrl.concat('?phase=').concat('C')); // Phase C Campaign
  //   }
  //   tomorrow.setDate(tomorrow.getDate() + 1)
  // }
}

