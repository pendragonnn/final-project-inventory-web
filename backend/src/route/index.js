const express = require("express");
const router = express.Router();

const outletsRoutes = require("../route/outlet.route");

router.use("/", outletsRoutes);

module.exports = router;
