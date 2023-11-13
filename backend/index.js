const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
<<<<<<< HEAD
const itemRouter = require("./src/route/items");
=======

const router = require('./src/route/index')
>>>>>>> eb0ecc442ec1c51bb6e727ba823f72269f9ecdba
const app = express();

dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

<<<<<<< HEAD
const router = require("./src/route/index");
app.use(router);
=======

app.use(router)
app.use(itemRouter)
>>>>>>> eb0ecc442ec1c51bb6e727ba823f72269f9ecdba

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on https://localhost: ${PORT}`);
});
