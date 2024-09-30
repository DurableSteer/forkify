import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds.`));
    }, s * 1000);
  });
};

const AJAX = async function(url, uploadData = undefined) {
  try {
    const res = await Promise.race([fetch(url,uploadData), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const getJSON = async function (url) {
  return await AJAX(url);
};

export const sendJSON = async function (url, uploadData) {
  return await AJAX(url, {method:'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(uploadData)
  });
};