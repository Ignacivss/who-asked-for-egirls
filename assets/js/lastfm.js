function thingforshortershit(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength) + ".." : text;
}

function progressbar() {
  var progressBar = document.getElementById("prog");
  var currentValue = parseInt(progressBar.getAttribute("value"));

  if (currentValue < 100) {
    currentValue += 1;
    progressBar.setAttribute("value", currentValue);
  } else {
    progressBar.setAttribute("value", "0");
  }
}

function retrieveSFM() {
  $.ajax({
    type: "GET",
    url: "https://api.stats.fm/api/v1/users/rocjou/streams/current",
    success: function (data) {
      var track = data.item.track;
      var duration = parseInt(track.durationMs);
      var current = parseInt(data.item.progressMs);
      var percent = current / duration * 100;

      document.getElementById("prog").setAttribute("value", percent);
      document.getElementById("title").innerHTML = thingforshortershit(track.name, 18);
      document.getElementById("artist").innerHTML = "by " + thingforshortershit(track.artists[0].name, 18);
      document.getElementById("album").innerHTML = "on " + thingforshortershit(track.albums[0].name, 18);
      document.getElementById("cover").src = track.albums[0].image;

      var listeningContainer = document.getElementById("listening-container");
      var listeningLabel = document.getElementById("listening-label");

      listeningContainer.style.display = "inline-block";
      listeningLabel.style.display = "inline-block";
      listeningLabel.innerHTML = "LISTENING TO SPOTIFY";

      listeningContainer.onclick = function () {
        window.open("https://open.spotify.com/track/" + track.externalIds.spotify[0], "_blank");
      };

      listeningContainer.style.cursor = "pointer";
    },
    error: function (error) {
      if (error.status !== 404) {
        console.log(error.status);
        document.getElementById("listening-container").style.display = "none";
        document.getElementById("listening-label").style.display = "none";
      }
    }
  });
}

retrieveSFM();
setInterval(retrieveSFM, 30000);
setInterval(progressbar, 1000);
