let micStream;
let isMuted = false;

async function startMic() {
    try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const micTracks = micStream.getTracks();

        micTracks.forEach(track => track.enabled = true);

        document.querySelector('.mic-on').style.display = 'none';
        document.querySelector('.mic-off').style.display = 'inline';
    } catch (err) {
        console.error("Error accessing the microphone:", err);
    }
}

function toggleMic() {
    if (micStream) {
        const micTracks = micStream.getTracks();
        isMuted = !isMuted;
        micTracks.forEach(track => track.enabled = !isMuted);

        if (isMuted) {
            document.querySelector('.mic-on').style.display = 'inline';
            document.querySelector('.mic-off').style.display = 'none';
        } else {
            document.querySelector('.mic-on').style.display = 'none';
            document.querySelector('.mic-off').style.display = 'inline';
        }
    }
}

window.onload = startMic;