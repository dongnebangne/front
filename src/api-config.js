let backendHost;

const hostname = window && window.location && window.location.hostname;

if( hostname === "localhost") {
    backendHost = "http://localhost:8000"; 
} else {
    backendHost = "http://52.79.103.59"; 
}

export const API_BASE_URL = `${backendHost}`;