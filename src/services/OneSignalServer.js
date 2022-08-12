import { api_server_url } from "src/config/urls";
import { GetApi, PostApi } from "./Axios";

export async function SendWebPushByCode(code, headings, subtitle, campaign, datetime, topic, click_url) {
  console.log("Sending Web Push...");
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
      console.log(value);
    });
}

export async function SendSMSByCode(code, subtitle, datetime, click_url) {
  console.log("Sending SMS Push...");
  let body = {
    code: code,
    subtitle: subtitle,
    datetime: datetime,
    click_url: click_url
  }
  await PostApi(api_server_url + '/sms-push', body)
    .then(function (value) {
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

