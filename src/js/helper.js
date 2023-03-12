import { TIMEOUT_SECONDS } from "./config.js";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // Fetch from API with Timeout lock
    const responseAPI = await Promise.race([
      fetchPro,
      timeout(TIMEOUT_SECONDS),
    ]);

    if (!responseAPI.ok)
      throw new Error("AJAX helper Fn (API didn't get a response)");
    let responseJSON = await responseAPI.json();

    return responseJSON;
  } catch (err) {
    throw err;
  }
};
