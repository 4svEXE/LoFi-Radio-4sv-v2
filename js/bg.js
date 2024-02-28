//localStorage.setItem(APP_NAME + 'Play', 'false')

setInterval(() => {
  let storage = JSON.parse(localStorage.getItem(APP_NAME));

  if (storage.play === "true") {
    //If the station is playing then save about this in localStorage
    //it is for loader's right work

    $(".radio").play().then(function () {
        localStorage.setItem(APP_NAME + 'Play', 'true')
      })
      .catch(function (error) {});
  } else {
    $(".radio").pause();
    $(".radio").src = storage.url;
    localStorage.setItem(APP_NAME + 'Play', 'false')
  }

  $(".radio").volume = storage.volume;
}, 100);