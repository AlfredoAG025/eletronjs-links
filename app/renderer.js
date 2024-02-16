// DOM Elements

const linksSection = document.querySelector(".links");
const errorMessage = document.querySelector(".error-message");
const newLinkForm = document.querySelector(".new-link-form");
const newLinkURL = document.querySelector(".new-link-url");
const newLinkButton = document.querySelector(".new-link-button");
const clearStorage = document.querySelector(".clear-storage");

// DOM APIS
const parser = new DOMParser();
//const { shell } = require('electron');

const parserResponse = text => {
    return parser.parseFromString(text, 'text/html');
}

const findTitle = (nodes) => {
    return nodes.querySelector('title').innerText;
}

const storeLink = (title, url) => {
    localStorage.setItem(url, JSON.stringify({title, url}));
}

const getLinks = () => {
    return Object.keys(localStorage).map(key => JSON.parse(localStorage.getItem(key)));
}

const createLinkElement = link => {
    return `
        <div>
            <h3>${link.title}</h3>
            <p>
                <a href="${link.url}">${link.url}</a>
            </p>
        </div>
    `;
}

const renderLinks = () => {
    const linksElements = getLinks().map(createLinkElement).join('');
    console.log(linksElements);
    linksSection.innerHTML = linksElements;
}

const clearForm = () => {
    newLinkURL.value = null;
	newLinkButton.setAttribute('disabled', true);
}

const handleError = (error, url) => {
	errorMessage.setAttribute("style", "display: block;")
    errorMessage.innerHTML = `
        There was an issue adding "${url}": ${error.message}
    `.trim();
    setTimeout(() => {
        errorMessage.innerHTML = null;
		errorMessage.setAttribute("style", "display: none;")
    }, 5000);
}

// Events
renderLinks();

newLinkURL.addEventListener("keyup", () => {
  newLinkButton.disabled = !newLinkURL.validity.valid;
});

newLinkForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const url = newLinkURL.value;
    try {
        const response = await fetch(url);
        const text = await response.text();
        const html = parserResponse(text);
        const title = findTitle(html);
        storeLink(title, url);
        clearForm();
        renderLinks();
    } catch(error){
        handleError(url, error);
    }
    
});

clearStorage.addEventListener('click', () => {
    localStorage.clear();
    linksSection.innerHTML = '';
})

linksSection.addEventListener('click', (e) => {
	if (e.target.href){
		e.preventDefault();
		console.log(e.target.href);
	}
})