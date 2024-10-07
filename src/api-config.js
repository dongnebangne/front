let backendHost;

const hostname = window && window.location && window.location.hostname;

if( hostname === "localhost") {
    //backendHost = "http://localhost:8000"; 
    backendHost = "http://3.35.119.183"; 
} else {
    backendHost = "http://3.35.119.183"; 
}

export const API_BASE_URL = `${backendHost}`;