import { api_server_url } from "src/config/urls";
import { GetApi } from "./Axios";

export async function findSession(code) { // Retrieve user session
  console.log('Getting session...');

  const session = await GetApi(api_server_url + '/session/user/' + code)
    .then(value => value);

  return { ...session };
}


export async function findUser(code) { // Retrieve user
  console.log('Getting user...');

  const user = await GetApi(api_server_url + '/user/' + code)
    .then(value => value);

  return { ...user };
}

export async function findRole(RoleId) { // Retrieve user
  console.log('Getting role...');

  const role = await GetApi(api_server_url + '/role/' + RoleId)
    .then(value => value);

  return { ...role };
}

export async function findOtherUsers(session_id, code) { // Retrieve other users
  console.log('Getting other users...');

  const users = await GetApi(api_server_url + '/session/users/' + session_id + '/' + code)
    .then(value => value);

  return users;
}

export async function findOtherUsersAnswered(session_id, code, phase) { // Retrieve other users
  console.log('Getting other users answered...');

  const users = await GetApi(api_server_url + '/questions/answered/' + session_id + '/' + code + '/' + phase)
    .then(value => value);

  return users;
}