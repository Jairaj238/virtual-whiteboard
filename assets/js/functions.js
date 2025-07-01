const canvas = document.querySelector("#whiteboard");
const ctx = canvas.getContext("2d");

const penSlide = document.querySelector("#pen-width");
const inkColor = document.querySelectorAll(".color-swatch");
const penButton = document.getElementById("pen");
const eraserBtn = document.getElementById("eraser");
const pointerBtn = document.getElementById("pointer");
const highlighterBtn = document.getElementById("highlighter");
const trashBtn = document.getElementById("trash");
const undoBtn = document.getElementById("undo");
const redoBtn = document.getElementById("redo");

const shapeBtn = document.querySelectorAll(".shapeBtn");
const fillColor = document.getElementById('fillColor');

const overDiv = document.getElementsByClassName("overdiv")[0];
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");

let isDrawing = false;
let penWidth = 3;
let selectedColor = "#000000";
let selectedTool = "pen";

let canvasHistory = [];
let historyStep = -1;

let prevMouseX, prevMouseY, snapshot;

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = penWidth;
    ctx.strokeStyle = selectedColor;
    saveCanvasSate();
});

const saveCanvasSate = () => {
    if(historyStep < canvasHistory.length - 1){
        canvasHistory = canvasHistory.slice(0, historyStep + 1);
    }
    canvasHistory.push(canvas.toDataURL());
    historyStep++;
}

const restoreCanvasState = () => {
    if(historyStep > 0){
        historyStep --;
        let canvasPic = new Image();
        canvasPic.src = canvasHistory[historyStep];
        canvasPic.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasPic, 0, 0);
        }
    }
};

const redoCanvasState = () => {
    if(historyStep < canvasHistory.length - 1){
        historyStep ++;
        let canvasPic = new Image();
        canvasPic.src = canvasHistory[historyStep];
        canvasPic.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasPic, 0, 0);
        }
    }
};


const drawRect = (e) => {
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillStyle = selectedColor;
    return ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.fillStyle = selectedColor;
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawLine = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}

const drawTriangle = (e) => {
    ctx.fillStyle = selectedColor;
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = penWidth;
    snapshot = ctx.getImageData(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.moveTo(e.offsetX, e.offsetY);
}

const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);

    if(selectedTool === "pen"){
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }else if(selectedTool === "eraser"){
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.stroke();
    }else if(selectedTool === "pointer"){
        isDrawing = false;
    }else if(selectedTool === "highlighter"){
         ctx.globalCompositeOperation = "multiply";
         ctx.lineTo(e.offsetX, e.offsetY);
         ctx.globalAlpha = 0.13;
         ctx.strokeStyle = selectedColor;
         ctx.lineWidth = 25;
         ctx.stroke();
    }else if(selectedTool === "rectangle"){
        drawRect(e);
    }else if(selectedTool === "circle"){
        drawCircle(e);
    }else if(selectedTool === "line"){
        drawLine(e);
    }else if(selectedTool === "triangle"){
        drawTriangle(e);
    }
}

shapeBtn.forEach(button => {
    button.addEventListener("click", function() {
        shapeBtn.forEach(btn => btn.classList.remove('selected-shape'));
        button.classList.add('selected-shape');

        if(button.id === "rectangle"){
            selectedTool = "rectangle";
        }else if(button.id === "circle"){
            selectedTool = "circle";
        }else if(button.id === "line"){
            selectedTool = "line";
        }else if(button.id === "triangle"){
            selectedTool = "triangle";
        }
        console.log(button.id);
    });
});

redoBtn.addEventListener("click", redoCanvasState);
undoBtn.addEventListener("click", restoreCanvasState);


trashBtn.addEventListener("click", () => {
    overDiv.style.display ='flex';
});

yesBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    overDiv.style.display ='flex';
});

noBtn.addEventListener("click", () => {
    overDiv.style.display ='none';
});

highlighterBtn.addEventListener("click", () => {
    isDrawing = false;
    selectedTool = "highlighter";
    ctx.globalCompositeOperation = "multiply";
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.globalAlpha = 0.13;
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = 25;
});

pointerBtn.addEventListener("click", () => {
    isDrawing = false;
    selectedTool = "pointer";
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = "source-over";
});

eraserBtn.addEventListener("click", () => {
    isDrawing = false;
    selectedTool = "eraser";
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = penWidth
});

function resetCtx() {
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = penWidth;
}


penSlide.addEventListener("input", () => {
    penWidth = penSlide.value;
    ctx.lineWidth = penWidth;
});

inkColor.forEach((swatch) => {
    swatch.addEventListener("click", () => {
        inkColor.forEach((btn) => btn.classList.remove("selected-color"));
        swatch.classList.add("selected-color");
        selectedColor = swatch.dataset.color;
        ctx.strokeStyle = selectedColor;
    });
})

penButton.addEventListener("click", () =>{
    isDrawing = false;
    selectedTool = "pen";
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = penWidth;
});

canvas.addEventListener("mousedown", (e) => {
    saveCanvasSate();
    startDraw(e);
});

canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () =>{
    isDrawing = false;
    ctx.closePath();
});

const penWidthSlider = document.getElementById("pen-width");

function updateSliderBackground(slider) {
  const val = (slider.value - slider.min) / (slider.max - slider.min) * 100;
  slider.style.background = `linear-gradient(to right, black ${val}%, #ddd ${val}%)`;
}

penWidthSlider.addEventListener("input", function () {
  updateSliderBackground(this);
});

// Call once to set initial background
updateSliderBackground(penWidthSlider);
