let backendHost;

const hostname = window && window.location && window.location.hostname;

const prodHost = 'ibleedfilm.github.io';
const herokuHost = 'https://spooky-plague-26435.herokuapp.com/';
const localHost = 'http://localhost/';

if (hostname === prodHost) {
    backendHost = herokuHost;
} else {
    backendHost = process.env.EMOTION_HOST || localHost;
}

const API_ROOT = backendHost;

export { API_ROOT as default };
