// Obtener una referencia al botón, al elemento que contiene el texto, y a los elementos que contienen el idioma, la voz y la velocidad
var citySelect = document.getElementById('city-select');
var languageSelect = document.getElementById('language-select');
var voiceSelect = document.getElementById('voice-select');
var rateInput = document.getElementById('rate-input');
const velocityDisplay = document.getElementById('display-velocity');
let stateSelect = document.getElementById('state-select')
let textSelect = document.getElementById('text')

var cities,states
fetch('./data.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(jsonData) {
    cities =jsonData[0].cities
    states = jsonData[0].state
    states.forEach(function(state){
      stateSelect.innerHTML += `<option value="${state}">${state}</option>`
    })
  })
  .catch(function(error) {
    console.log('Error:', error);
  });


const initialLanguageSelected = {
  target: {
    value: "en"
  }
}

const defaultStorage = {
  voice: "",
  velocity: "1.0",
  language: "en",
  text: ""
};

let storage = getItemFromStorage();

if (!storage) {
  storage = defaultStorage;
  setItemOnStorage();
}

var voices = [];

if (!window.location.pathname.match("index.html") && !storage.voice.length) {
  goBack()
}

window.speechSynthesis.onvoiceschanged = function() {
  voices = window.speechSynthesis.getVoices();
  if (window.location.pathname.match("index.html")) {
    onLanguageSelected(initialLanguageSelected)
  }
};

function getItemFromStorage() {
  let itemValue = JSON.parse(window.localStorage.getItem("text_to_speech"));
  return itemValue;
}
function setItemOnStorage() {
  return window.localStorage.setItem("text_to_speech", JSON.stringify(storage));
}
function getValueFromStorage(item) {
  return storage[item];
}

function onLanguageSelected({target}) {
  storage.language = target.value
  const filteredVoices = voices.filter((voice) => {
    const language = voice.lang.slice(0,2)
    return language === storage.language
  })
  voiceSelect.innerHTML = ""
  filteredVoices.forEach(function(voice){
      voiceSelect.innerHTML += `<option value="${voice.name}">${voice.name}</option>`
  })
  // console.log("Selected voice: ", storage)
  setItemOnStorage()
}

function onVoiceSelected({target}) {
  storage.voice = target.value
  // console.log("Selected voice: ", storage)
  setItemOnStorage()
}

function onVelocitySelected({target}) {
  storage.velocity = target.value
  // console.log("Selected voice: ", storage)
  velocityDisplay.value = storage.velocity
  setItemOnStorage()
}

function onStateSelected({target}){
  let state = target.value
  const filterCities = cities.filter((city)=>{
    if (city.state === state){
      return city.city
    }
  })
  citySelect.innerHTML = '<option value="">Select a city</option>'
  filterCities.forEach(function(city){
    citySelect.innerHTML += `<option value="${city.city}">${city.city}</option>`
  })
}

function onCitySelected({target}){
  let state = stateSelect.value
  let city = citySelect.value
  let randomIndex = Math.floor(Math.random() * cities.length);
  let randomElement = cities[randomIndex];
  let cityStr = city.split('').join('-');
  sentence = `Leaving from ${city}, ${state}, going to ${randomElement.city}, ${randomElement.state}`
  textSelect.innerHTML =  sentence
  onTextSelected(sentence)

}

function onTextSelected(text) {
  storage.text = text
  // console.log("Selected voice: ", storage)
  setItemOnStorage()
}

function onSubmit() {
  if ('speechSynthesis' in window) {
    const {text, voice, language, velocity} = storage
    // Obtener una referencia al objeto SpeechSynthesis
    const synthesis = window.speechSynthesis;

    // Crear un objeto SpeechSynthesisUtterance con el texto a convertir a voz
    const utterance = new SpeechSynthesisUtterance(text);

    // Elegir la voz correspondiente a la opción seleccionada
    const selectedVoice = voices.find((item) => {
      return item.name === voice;
    });

    // Configurar la voz, el idioma y la velocidad de reproducción
    utterance.voice = selectedVoice;
    utterance.lang = language;
    utterance.rate = velocity;

    // Reproducir el texto convertido a voz
    synthesis.speak(utterance);
  } else {
    // Mostrar un mensaje de error si el navegador no soporta la Web Speech API
    console.log('Text-to-speech no soportado.');
  }
}


