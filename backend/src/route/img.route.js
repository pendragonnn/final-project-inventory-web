const express = require('express');
const route = express.Router()
const upload = require ("../controller/user.controller")

route.get("/:id", upload.getUserPhoto);

module.exports = route