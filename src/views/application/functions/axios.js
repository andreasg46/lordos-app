
import axios from "axios";
import { Alert } from "../components/Alerts";
import { getCookie } from "../components/Cookies";


export async function GetApi(url) {
  var data = "";

  await axios.get(url).then((response) => {
    data = response.data;
    return data;
  }).catch(function (error) {
    if (getCookie('session_id') !== '') {
      Alert(error.response.data.error, 'error');
      console.log(error.response.data);
    }
  });
  return data;
}


export async function PostApi(url, object) {
  var data = "";

  await axios.post(url, object).then(function (response) {
    data = response.data;
    return data;
  }).catch(function (error) {
    Alert(error.response.data.error, 'error');
    console.log(error.response.data);
  });
  return data;
}

export async function PutApi(url, object) {
  var data = "";

  await axios.put(url, object).then(function (response) {
    data = response.data;
    return data;
  }).catch(function (error) {
    Alert(error.response.data.error, 'error');
    console.log(error.response.data);
  });
  return data;
}

export async function DeleteApi(url) {
  var data = "";

  var text = 'Are you sure you want to delete?'

  if (window.confirm(text) === true) {
    await axios.delete(url).then(function (response) {
      data = response.data;

      Alert(response.data.message, 'success');

      return data;
    }).catch(function (error) {
      Alert(error.response.data.error, 'error');
      console.log(error.response.data);
    });
  }
  return data;
}