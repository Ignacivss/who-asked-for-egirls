var audio = document.getElementById('audio')
var init = false

audio.volume = 0.085

function start() {
    if (init) return
    else init = true
    
}

setInterval(() => {
    audio.play()
    .then(() => {
        start()
        document.getElementsByName('container_init')[0].style.visibility = 'hidden'
        document.getElementsByName('container_main')[0].style.visibility = 'visible'
    })
    .catch(err => {})
}, 100)