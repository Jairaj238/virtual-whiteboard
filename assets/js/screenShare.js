let screenStream;
let isScreenSharing = false;
let videoElement;


document.getElementById("screen_share").addEventListener("click", async function () {
     const whiteboard = document.getElementById('whiteboard');

     if(isScreenSharing){
        stopScreenSharing();
    }else{
        try{
            screenStream = await navigator.mediaDevices.getDisplayMedia({ video : true});

            videoElement = document.createElement('video');
            videoElement.srcObject = screenStream;
            videoElement.play();

            videoElement.onloadedmetadata = () => {
                whiteboard.width = videoElement.videoWidth;
                whiteboard.height = videoElement.videoHeight;
            drawVideoToCanvas();
            };

            isScreenSharing = true;

        }catch (error){
            console.log('Error starting screen sharing');
        }
    }
});

function drawVideoToCanvas() {
    const whiteboard = document.getElementById('whiteboard');
    const context = whiteboard.getContext("2d");

    function render() {
        if(videoElement.paused || videoElement.ended) return;
        context.drawImage(videoElement, 0,0,whiteboard.width, whiteboard.height);
        requestAnimationFrame(render);
    }

    render();
}

function stopScreenSharing() {
    if(screenStream){
        const tracks = screenStream.getTracks();
        tracks.forEach(track => track.stop());
            
        screenStream = null;
        isScreenSharing = false;

        document.getElementById("webcam").style.display = 'block';
        const whiteboard = document.getElementById('whiteboard');
        whiteboard.style.zIndex = '5';
    }
}