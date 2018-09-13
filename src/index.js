"use strict";
require('dotenv').config();
const Auth = require('./operations/Authenticate');
const request = require('request-promise');

function Client (options) {
    this.init = () =>{new Auth()}
}

const client = new Client()
client.init()