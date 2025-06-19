const screenMax = document.querySelector(".screen-max");
const screenMin = document.querySelector(".screen-min");

document.getElementById("screen-toggle").addEventListener("click", () => {

    if(!document.fullscreenElement && !document.mozFullscreenElement && !document.msFullscreenElement){
        
        if(document.documentElement.requestFullscreen){
            document.documentElement.requestFullscreen();
        }else if(document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        }else if(document.documentElement.mozRequestFullscreen) {
            document.documentElement.mozRequestFullscreen();
        }else if(document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }

        screenMax.style.display = 'none';
        screenMin.style.display = 'inline';
    }else{
        if(document.exitFullscreen){
            document.exitFullscreen();
        }else if(document.webkitExitFullscreen){
            document.webkitExitFullscreen();
        }else if(document.mozlCanceFullscreen){
            document.mozlCanceFullscreen();
        }else if(document.msexitFullscreen){
            document.msexitFullscreen();
        }

        screenMax.style.display = 'inline';
        screenMin.style.display = 'none';
    }
});