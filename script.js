const typingForm = document.querySelector('.typing-form');
const chatList = document.querySelector('.chat-list');

let userMessage = '';

// API Key and URL
const API_KEY = 'AIzaSyABVjmGr-M_Bhlb7p1XXMnl3JrtEp19pXc'
const beg = 'do not steal my api key i am lazy to add backend if you do i will terminate the key'
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`

// Create a message element
const createMessageElement = (content, ...className) => {
  const div = document.createElement('div');
  div.classList.add('message', ...className);
  div.innerHTML = content;
  return div;
}

// Fetch data from the API based on the user's input
const generateAPIResponse = async (incomingMessageDiv) => {
  const textElement = incomingMessageDiv.querySelector('.text');// Get the text element of the incoming message
  
  // Make a POST request to the API
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: userMessage }]
        }]
      })
    })
    const data = await response.json();

    const apiResponse = data?.candidates[0].content.parts[0].text

    textElement.innerText = apiResponse;
  } catch (error) {
    console.log(error)
  }finally{
    incomingMessageDiv.classList.remove('loading');
  }
}

//Show a loading animation while waiting for a response
const showLoadingAnimation = () => {
  const html = 
  `      <div class="message-content">
        <img src="images/gemini.svg" alt="Gemini Image" class="avatar">
        <p class="text"></p>
        <div class="loading-indicator">
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
        </div>
      </div>
      <span onClick="copyMessage(this)" class="icon material-symbols-outlined">content_copy</span>`

const incomingMessageDiv = createMessageElement(html,"incoming","loading" );
chatList.appendChild(incomingMessageDiv);

generateAPIResponse(incomingMessageDiv)

}

// Copy the message to the clipboard
const copyMessage = (copyIcon) => {
  const messageText = copyIcon.parentElement.querySelector(' .text').innerText
  navigator.clipboard.writeText(messageText)
  copyIcon.innerText = 'done'
  setTimeout(() => {
    copyIcon.innerText = 'content_copy'
  }, 2000)
}

const handleOutGoingChat = () => {
  userMessage = typingForm.querySelector('.typing-input').value;
  if(userMessage.trim() === '') return; //exit if empty

  const html = 
       ` <div class="message-content">
        <img src="images/user.jpg" alt="User Image" class="avatar">
        <p class="text"></p>
      </div>`

  const outgoingMessageDiv = createMessageElement(html,"outgoing" );
  outgoingMessageDiv.querySelector('.text').textContent = userMessage;
  chatList.appendChild(outgoingMessageDiv);

  typingForm.reset()
  setTimeout(showLoadingAnimation, 500)
}

typingForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.querySelector('.typing-form input');
  handleOutGoingChat()
})