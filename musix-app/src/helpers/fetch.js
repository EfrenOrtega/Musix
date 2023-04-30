export default  async function fetchAJAX(parametros) {

  let { url, settings, resSuccess, resError } = parametros;

  const controller = new AbortController();
  // const signal = controller.signal;

  setTimeout(() => controller.abort(), 1000);

  return fetch(url, settings)
    .then(res => { return res.ok ? res.json() : Promise.reject(res) })
    .then(json => {
      if (json.success !== false) {
        return resSuccess(json)
      } else {
        console.error("Huvo un Error:", json.message)
      }
    })
    .catch(err => {
      resError(err)
    })
}

