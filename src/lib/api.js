
const network = require('./api/network')
const toast = require('./api/toast')
const openapi = require('./api/openapi')
const audio = require('./api/audio')
const router = require('./api/router')

const api = Object.assign(network, toast,openapi, audio, router);

module.exports = api
