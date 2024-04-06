export default  async function fetchAJAX(parametros) {

  let { url, settings, resSuccess, resError } = parametros;

  const controller = new AbortController();
  // const signal = controller.signal;

  setTimeout(() => controller.abort(), 1000);

  return fetch(`http://192.168.1.69:5000/${url}`, settings)
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

