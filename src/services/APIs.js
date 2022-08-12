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