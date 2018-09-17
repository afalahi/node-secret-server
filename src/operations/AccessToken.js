const fileSystem = require('fs');
const request = require('request-promise');

class AccessToken {
    constructor(url){
        this.url = url;
    }
    loadCredentials() {
        fileSystem.readFile("creds.json", (err, file) => {
            if(err) {
                throw "App not initialized"
            }
            let creds = (JSON.parse(file.toString()));
            return creds
        })
    }
}

const token = new AccessToken()
token.loadCredentials()