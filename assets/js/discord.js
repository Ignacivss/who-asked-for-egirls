var id = '1118844482188746842';
var pronouns = 'he/him';

function adjustUsernameFontSize(usernameElement) {
  var usernameLength = usernameElement.innerText.length;
  if (usernameLength > 16) {
    var fontSize = parseFloat(window.getComputedStyle(usernameElement).fontSize);
    var newFontSize = fontSize * (1 - 0.007 * (usernameLength - 16));
    usernameElement.style.fontSize = newFontSize + 'px';
  }
}

function info() {
  var url = 'https://api.lanyard.rest/v1/users/' + id;
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.send();
  request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        var data = JSON.parse(request.responseText);
        console.log(data);
        var status = data.data.discord_status;
        var presence = document.getElementById('presence');
        console.log(status);
        switch (status) {
          case 'dnd':
            presence.style.backgroundColor = '#f23f42';
            break;
          case 'online':
            presence.style.backgroundColor = '#23a559';
            break;
          case 'idle':
            presence.style.backgroundColor = '#d79f2f';
            break;
          case 'offline':
            presence.style.backgroundColor = '#80848e';
            break;
          default:
            presence.style.backgroundColor = '#80848e';
            break;
        }
        var displayName = document.getElementById('displayname');
        displayName.innerText = data.data.discord_user.global_name || data.data.discord_user.username;
        var username = document.getElementById('username');
        username.innerHTML = '<a href="https://discord.com/users/' + id + '" target="_blank">@' + data.data.discord_user.username + '</a> | <span class="pronouns">' + pronouns + '</span>';
        username.style.cursor = 'pointer';
        adjustUsernameFontSize(username);
        var avatarUrl = `https://api.lanyard.rest/${id}.png`;
        var avatarImg = document.getElementById('avatar');
        avatarImg.src = avatarUrl;
        var activity = data.data.activities.find(function (activity) {
          return activity.type === 4;
        });
        if (activity) {
          var createdAt = activity.created_at;
          var currentTime = Date.now();
          var timeDifference = currentTime - createdAt;
          timeDifference = Math.floor(timeDifference / 1000);
          if (timeDifference < 60) {
            statusLabel.innerHTML = activity.state + ' <span style="font-style: italic; color: #888888;">- Just now</span>';
          } else {
            if (timeDifference < 3600) {
              var minutes = Math.floor(timeDifference / 60);
              statusLabel.innerHTML = activity.state + ' <span style="font-style: italic; color: #888888;">- ' + minutes + 'm ago</span>';
            } else {
              if (timeDifference < 86400) {
                var hours = Math.floor(timeDifference / 3600);
                statusLabel.innerHTML = activity.state + ' <span style="font-style: italic; color: #888888;">- ' + hours + 'h ago</span>';
              } else {
                var days = Math.floor(timeDifference / 86400);
                statusLabel.innerHTML = activity.state + ' <span style="font-style: italic; color: #888888;">- ' + days + 'd ago</span>';
              }
            }
          }
        }
      } else {
        document.getElementById('discord_status').style.display = 'none';
      }
    }
  };
}

window.addEventListener('load', function () {
  info();
});
