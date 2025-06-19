const sendMessageButton = document.querySelector('.send-msg-box .chat-btn');
const messageInput = document.getElementById('tutor-message');
const messageDisplay = document.getElementById('student-message');
const scrollToLastBtn = document.getElementById('scroll-to-latest');

let pinnedMessage = null;

document.addEventListener("DOMContentLoaded", () => {

    function addStudentMessage(content) {
        const messageElement = createMessageElement(content, 'Student'); //Change 'Student' name from database
        messageDisplay.appendChild(messageElement);
        scrollToBottom();
    }

    sendMessageButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim();

        if(messageText){
            const messageElement = createMessageElement(messageText, 'Tutor'); //Change 'Tutor' name from the database
            messageDisplay.appendChild(messageElement);

            messageInput.value = '';
            scrollToBottom();
        }
    });

    messageInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' && !e.shiftKey){
            e.preventDefault();
            sendMessageButton.click();
        }
    });

    function createMessageElement(content, sender){
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `
            <strong>${sender}: </strong>${content}
            <button class="pin-btn" title="Pin Message"><i class="fa-solid fa-thumbtack"></i></button>
        `;

        const pinButton = messageElement.querySelector('.pin-btn');
        pinButton.addEventListener('click', () => pinMessage(messageElement, content, sender));
        return messageElement;
    }

    function pinMessage(messageElement, content, sender){
        if(pinnedMessage){
            pinnedMessage.remove();
        }

        pinnedMessage = document.createElement('div');
        pinnedMessage.classList.add('pinned-message');
        pinnedMessage.innerHTML = `
            <strong>${sender}: </strong>${content}
            <button class="unpin-btn" title="UnPin Message"><i class="fa-solid fa-thumbtack-slash"></i></button>
        `;

        const unpinButton = pinnedMessage.querySelector('.unpin-btn');
        unpinButton.addEventListener('click', () => {
            pinnedMessage.remove();
            pinnedMessage = null;
        });

        messageDisplay.prepend(pinnedMessage);
    }

    // Scroller

    function scrollToBottom(){
        messageDisplay.scrollTop = messageDisplay.scrollHeight;
    }

    messageDisplay.addEventListener('scroll', () => {
        const {scrollTop, scrollHeight, clientHeight} = messageDisplay;

        if(scrollHeight - scrollTop > clientHeight + 30) {
            scrollToLastBtn.style.display = 'block';
        }else{
            scrollToLastBtn.style.display = 'none';
        }
    });

    scrollToLastBtn.addEventListener('click', () => {
        messageDisplay.scrollTo({
            top: messageDisplay.scrollHeight,
            behavior: 'smooth'
        });
    });

    function scrollToBottom(){
        messageDisplay.scrollTo({
            top: messageDisplay.scrollHeight,
            behavior: 'smooth'
        });

        scrollToLastBtn.style.display = 'none';
    }
});