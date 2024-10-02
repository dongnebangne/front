let backendHost;

const hostname = window && window.location && window.location.hostname;

if( hostname === "localhost") {
    //backendHost = "http://localhost:8000"; 
    backendHost = "43.201.102.175"; 
} else {
    backendHost = "43.201.102.175"; 
}

export const API_BASE_URL = `${backendHost}`;