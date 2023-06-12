var languageSelect = document.getElementById('language-select');
var voiceSelect = document.getElementById('voice-select');
var velocityDisplay = document.getElementById('display-velocity')
var generateButton = document.getElementById('generate-button')
var numInput = document.getElementById('number')
var setencesList = document.getElementById('setences-random')
var sentenceDiv = document.getElementById("div-random")
var voices = [];
let language_select,voice
let velocity = '1.0'
var cities
fetch('./data.json')
    .then(function(response) {
    return response.json();
    })
    .then(function(jsonData) {
    cities =jsonData[0].cities
    })
    .catch(function(error) {
    console.log('Error:', error);
    }
);



const defaultStorage = {
    voice: "",
    velocity: "1.0",
    language: "en",
    text: ""
    };



const initialLanguageSelected = {
    target: {
        value: "en"
    }
}

window.speechSynthesis.onvoiceschanged = function() {
    voices = window.speechSynthesis.getVoices();
    if (window.location.pathname.match("game.html")) {
        onLanguageSelected(initialLanguageSelected)
    }
    };

function onLanguageSelected({target}) {
    language_select= target.value
    const filteredVoices = voices.filter((voice) => {
        const language = voice.lang.slice(0,2)
        return language === language_select
    })
    voiceSelect.innerHTML = ""
    filteredVoices.forEach(function(voice){
        voiceSelect.innerHTML += `<option value="${voice.name}">${voice.name}</option>`
    })
    // console.log("Selected voice: ", storage)
    }

function onVoiceSelected({target}) {
    voice = target.value

    }

function onVelocitySelected({target}) {
    velocity = target.value
    // console.log("Selected voice: ", storage)
    velocityDisplay.value = velocity
    }

function getRandomCity(){
    let randomIndex = Math.floor(Math.random() * cities.length);
    let randomElement = cities[randomIndex];
    return randomElement
}

function onGenerateSentences(){
    let numSentences = numInput.value
    console.log(numSentences)
    setencesList.innerHTML = ' '
    for(let i = 1;i<=numSentences;i++){
        city1 = getRandomCity()
        city2 =getRandomCity()
        sentence = `Leaving from ${city1.city}, ${city1.state}, going to ${city2.city}, ${city2.state}`
        setencesList.innerHTML += `${sentence}.<br>`
    }
    onSubmit()
}

function onSubmit() {
    if ('speechSynthesis' in window) {
        // const {text, voice, language, velocity} = storage
      // Obtener una referencia al objeto SpeechSynthesis
        let text = setencesList.innerHTML
        const synthesis = window.speechSynthesis;

      // Crear un objeto SpeechSynthesisUtterance con el texto a convertir a voz
        const utterance = new SpeechSynthesisUtterance(text);

      // Elegir la voz correspondiente a la opción seleccionada
        const selectedVoice = voices.find((item) => {
        return item.name === voice;
        });

      // Configurar la voz, el idioma y la velocidad de reproducción
        utterance.voice = selectedVoice;
        utterance.lang = language_select;
        utterance.rate = velocity;

      // Reproducir el texto convertido a voz
        synthesis.speak(utterance);
    } else {
      // Mostrar un mensaje de error si el navegador no soporta la Web Speech API
        console.log('Text-to-speech no soportado.');
    }
}