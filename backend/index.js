const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
app.use(express.json());

const router = require("./src/route/outlet.route");
app.use(router);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("server is running");
});
