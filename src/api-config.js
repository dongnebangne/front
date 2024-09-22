let backendHost;

const hostname = window && window.location && window.location.hostname;

if( hostname === "localhost") {
    backendHost = "http://safecid-be-env.eba-dbtmkx4p.ap-northeast-2.elasticbeanstalk.com/"; 
}

export const API_BASE_URL = `${backendHost}`;