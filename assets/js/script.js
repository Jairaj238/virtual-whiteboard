// Tools
const tools = document.querySelector(".open-tools");
const openTools = document.querySelector(".open-tools .open");
const closeTools = document.querySelector(".open-tools .close");
const toolsMenu = document.querySelector(".tools");

tools.addEventListener('click', () => {
    if (toolsMenu.style.display == "none") {
	    toolsMenu.style.display = 'flex';
        openTools.style.display = 'none';
        closeTools.style.display = 'flex';  
    }else{
        toolsMenu.style.display = 'none';
	    openTools.style.display = 'flex';
        closeTools.style.display = 'none'; 
    }
});


//Dropdown
const dropdownBtn = document.querySelector(".tool-btn.pen");
const dropdown = document.querySelector(".dropdown");

dropdownBtn.addEventListener('click', (event) =>{
    event.stopPropagation();
    const isDropdownOpen = dropdown.style.display == 'flex';
    dropdown.style.display = isDropdownOpen ? 'none' : 'flex';
});

document.addEventListener('click', (event) => {
    if (dropdown.style.display == 'flex' && !dropdown.contains(event.target) && !dropdownBtn.contains(event.target)){
        dropdown.style.display = 'none';
    }
});


//Icon Change
const toolBtn = document.querySelector(".tool-btn.pen span");
const toolDropdown = document.querySelector("pen-dropdown");
const toolButtons = document.querySelectorAll(".dropdown-items-btn .other-tools");

const updateToolButtonIcon = (selectedTool) => {
    const icon = selectedTool.querySelector("i").cloneNode(true);
    toolBtn.innerHTML = "";
    toolBtn.appendChild(icon);
};

toolButtons.forEach((button) => {
    button.addEventListener('click', () =>{
        if(button.querySelector("i").classList.contains("fa-trash")){
            console.log("Erase All button is triggered");
            return;
        }
	    toolButtons.forEach((btn) => btn.classList.remove("selected-tool"));
	    button.classList.add("selected-tool");
	    updateToolButtonIcon(button);
	    toolDropdown.classList.remove("open");
    });
});

toolBtn.addEventListener('click', () => {
    toolDropdown.classList.toggle("open");
})


//Cursor Changing
const workspace = document.querySelector("body");

const updateCursor = (selectedTool) => {
    const iconElement = selectedTool.querySelector("i");
    const iconClass = iconElement.className.split(" ").pop();

    const fontAwesomeUnicode = getFontAwesomeUnicode(iconClass);
    if(!fontAwesomeUnicode){
        console.error(`Unable to find the Unicode for class ${iconClass}`);
        return;
    }

    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    canvas.height = 32;
    canvas.width = 32;
    ctx.font = "16px FontAwesome";
    ctx.fillstyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(fontAwesomeUnicode, canvas.width/2, canvas.height/2);
    const CursorUrl = canvas.toDataURL();
    workspace.style.cursor = `url(${CursorUrl}) 16 16, auto`;
};

toolButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if(botton.querySelector("i").classList.contains("fa-trash")){
            console.log("Erase All button is triggered");
            return;
        }
        toolButtons.forEach((btn) => btn.classList.remove("selected-tool"));
        button.classList.add("selected-tool");
        updateCursor(button);
    });
});

const getFontAwesomeUnicode = (className) => {
    const unicodeMap = {
        "fa-pencil": "\uf304",
        "fa-highlighter": "\uf591",
        "fa-eraser": "\uf12d",
        "fa-circle": "\uf111",
        "fa-trash": "\uf1f8",
    };
    return unicodeMap[className] || null;
};


//live chat 
const liveChatBtn = document.getElementById("live-chat");
const chatSection = document.querySelector(".chat-section");

liveChatBtn.addEventListener('click', () =>{
    chatSection.style.display = (chatSection.style.display === "none" || chatSection.style.display === "") ? 'flex' : 'none'; 
});



// Setting Open/Close
document.addEventListener("DOMContentLoaded", () => {
    const settingsBtn = document.getElementById("settings");
    const sidebar = document.getElementById("settings-sidebar");
    const closeSidebarBtn = document.getElementById("close-header");

    settingsBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });

    closeSidebarBtn.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });

    document.addEventListener("click", (event) => {
       if(!sidebar.contains(event.target) && !settingsBtn.contains(event.target)) {
           sidebar.classList.remove("open");
       }
    });
});


//Whiteboard color change
document.querySelectorAll('.whiteboard-bg').forEach(function(swatch){
    swatch.addEventListener('click', function() {
        const selectedColor = swatch.getAttribute('data-color');
        document.getElementById('whiteboard').style.backgroundColor = selectedColor;
    });
});

//Apply Custom Color
document.getElementById('custom-bg-color').addEventListener('input', function() {
    const customColor = this.value;
    document.getElementById('whiteboard').style.backgroundColor = customColor;
});



//Shapes open/Close
const shapeDrop = document.querySelector("#shape-dropdown");
const shapeDropBtn = document.querySelector(".shape");

shapeDropBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    const isDropdownOpen = shapeDrop.style.display == 'flex';
    shapeDrop.style.display = isDropdownOpen ? 'none' : 'flex';
});

document.addEventListener('click', (e) => {
    if(shapeDrop.style.display == 'flex' && !shapeDrop.contains(e.target) && !shapeDropBtn.contains(e.target)){
        shapeDrop.style.display = 'none';
    }
});

let chatIsRecording = false;
let chatMediaRecorder;
let chatAudioChunks = [];

const chatRecordBtn = document.getElementById('chat-record-btn');
const chatMessages = document.getElementById('student-message');

chatRecordBtn.addEventListener("click", async () => {
  if (!chatIsRecording) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chatMediaRecorder = new MediaRecorder(stream);
    chatAudioChunks = [];

    chatMediaRecorder.ondataavailable = (event) => {
      chatAudioChunks.push(event.data);
    };

    chatMediaRecorder.onstop = () => {
      const blob = new Blob(chatAudioChunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      const audio = document.createElement('audio');
      audio.src = url;
      audio.controls = true;

      const bubble = document.createElement('div');
      bubble.appendChild(audio);
      chatMessages.appendChild(bubble);

      // Show mic icon again
      chatRecordBtn.innerHTML = '<i class="bi bi-mic-fill"></i>';
      chatIsRecording = false;
    };

    chatMediaRecorder.start();
    chatIsRecording = true;
    chatRecordBtn.innerHTML = '<i class="bi bi-stop-circle-fill text-danger"></i>';
  } else {
    chatMediaRecorder.stop();
  }
});

document.getElementById('download-btn').addEventListener('click', () => {
    const dataURL = canvas.toDataURL("image/png");           // Convert canvas content to image data URL
    const a = document.createElement("a");                   // Create a temporary anchor (<a>) tag
    a.href = dataURL;                                        // Set image data as href
    a.download = "whiteboard_drawing.png";                   // Set default filename
    a.click();                                               // Simulate a click to trigger download
});

document.body.classList.toggle('dark-mode');