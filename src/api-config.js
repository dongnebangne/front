let backendHost;

const hostname = window && window.location && window.location.hostname;

if( hostname === "localhost") {
    //backendHost = "http://localhost:8000"; 
    backendHost = "http://52.78.97.23"; 
} else {
    backendHost = "http://52.78.97.23"; 
}

export const API_BASE_URL = `${backendHost}`;