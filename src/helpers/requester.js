const requester = data => (
  new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', `${process.env.API_URL}appointments`, true);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    request.onload = () => {
      if (request.readyState === 4) {
        if (request.status.toString().startsWith(4)) {
          reject({
            message: request.responseText,
            status: request.status,
          });
        } else {
          resolve({
            message: request.responseText,
            status: request.status,
          });
        }
      }
    };

    // Catch errors:

    request.onerror = (error) => {
      reject(error);
    };

    let params = '';
    Object.keys(data).forEach((k) => {
      if (params.length > 0) {
        params += '&';
      }
      params += `${k}=${encodeURIComponent(data[k])}`;
    });

    console.log(data);
    request.send(params);
  })
);

export default requester;
