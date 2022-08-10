export async function GetDevices() {
  let data = '';
  const url = 'https://onesignal.com/api/v1/players?app_id='.concat(process.env.REACT_APP_ONE_SIGNAL_APP_ID) + '&limit=300&offset=offset';
  const options = {
    method: 'GET',
    headers: {
      Accept: 'text/plain',
      Authorization: 'Basic '.concat(process.env.REACT_APP_ONE_SIGNAL_API_KEY)
    }
  };

  await fetch(url, options)
    .then(res => res.json())
    .then(json => {
      data = json;
    })
    .catch(err => console.error('error:' + err));

  return data;
}

export async function AddTags(userId, session_id, code) {
  // Check if user exists

  const options = {
    method: 'PUT',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: `${process.env.REACT_APP_ONE_SIGNAL_APP_ID}`,
      tags: {
        session_id: session_id,
        code: code
      }
    })
  };

  fetch('https://onesignal.com/api/v1/players/' + userId, options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}

export async function AddTagsWithExternalUserId(externalUserId, session_id, code) {
  // Check if user exists

  const options = {
    method: 'PUT',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: `${process.env.REACT_APP_ONE_SIGNAL_APP_ID}`,
      tags: {
        session_id: session_id,
        code: code
      }
    })
  };

  fetch('https://onesignal.com/api/v1/apps/' + `${process.env.REACT_APP_ONE_SIGNAL_APP_ID}` + '/users/' + externalUserId, options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}

export function SendPushBySession(session_id, headings, subtitle, campaign, datetime, topic, click_url) {
  headings = (headings === '' ? 'Default Heading' : headings);
  subtitle = (subtitle === '' ? 'Default Subtitle' : subtitle);
  campaign = (campaign === '' ? 'Default Campaign' : campaign);

  let body = {
    session_id: session_id,
    headings: { en: headings },
    subtitle: { en: subtitle },
    contents: { en: subtitle },
    campaign: campaign,
    datetime: datetime,
    topic: topic,
    url: click_url,
    send_after: datetime
  }

  console.log(body);

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Basic '.concat(process.env.REACT_APP_ONE_SIGNAL_API_KEY),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      app_id: `${process.env.REACT_APP_ONE_SIGNAL_APP_ID}`,
      filters: [
        { "field": "tag", "key": "session_id", "relation": "=", "value": session_id },
      ],
      external_id: '',
      headings: { en: headings },
      subtitle: { en: subtitle },
      contents: { en: subtitle },
      name: campaign,
      web_push_topic: topic,
      url: click_url,
      send_after: datetime,
    })
  };

  fetch('https://onesignal.com/api/v1/notifications', options)
    .then(response => response.json())
    .then(response => {
      console.log(response);
      response.errors ? console.log(response.errors) : console.log("Push Notification Send!");
    })
    .catch(err => console.error(err));
}

export async function DeleteDevice(playerId) {
  const options = {
    method: 'DELETE',
    headers: { Accept: 'application/json', Authorization: 'Basic '.concat(process.env.REACT_APP_ONE_SIGNAL_API_KEY) }
  };

  await fetch('https://onesignal.com/api/v1/players/'.concat(playerId).concat('?app_id=').concat(process.env.REACT_APP_ONE_SIGNAL_APP_ID), options)
    .then(response => response.json())
    .then(response => {
      console.log(response);
    })
    .catch(err => console.error(err));

}