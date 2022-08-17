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
  const clickUrl = app_url.concat('/#/questions');

  const smsContent = 'Questions available!';

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate());

  const total_days = 1;

  const deliveryTimeA = '20:25:00';
  const deliveryTimeB = '20:27:00';
  const deliveryTimeC = '20:33:00';

  //Welcome Message
  if (isIOS) {
    SendSMSByCode(phone, 'Welcome to Lordos App!', null, app_url);
  } else {
    SendWebPushByCode(code, headings, "Welcome to Lordos App!", campaign, datetime, topic, app_url);
  }

  for (let i = 0; i < total_days; i++) {
    const [next] = tomorrow.toISOString().split('T');

    console.log(next + 'T' + deliveryTimeA);

    if (isIOS) {
      SendSMSByCode(phone, smsContent, new Date(next + 'T' + deliveryTimeA), clickUrl.concat('?phase=').concat('A')); // Phase A Campaign
      SendSMSByCode(phone, smsContent, new Date(next + 'T' + deliveryTimeB), clickUrl.concat('?phase=').concat('B')); // Phase B Campaign
      SendSMSByCode(phone, smsContent, new Date(next + 'T' + deliveryTimeC), clickUrl.concat('?phase=').concat('C')); // Phase C Campaign
    } else {
      SendWebPushByCode(code, headings, subtitle, campaign, new Date(next + 'T' + deliveryTimeA), topic, clickUrl.concat('?phase=').concat('A')); // Phase A Campaign
      SendWebPushByCode(code, headings, subtitle, campaign, new Date(next + 'T' + deliveryTimeB), topic, clickUrl.concat('?phase=').concat('B')); // Phase B Campaign
      SendWebPushByCode(code, headings, subtitle, campaign, new Date(next + 'T' + deliveryTimeC), topic, clickUrl.concat('?phase=').concat('C')); // Phase C Campaign
    }
    tomorrow.setDate(tomorrow.getDate() + 1)
  }
}

