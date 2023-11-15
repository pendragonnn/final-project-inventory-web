const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const router = require('./src/route/index')
const app = express();

dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));


const router = require("./src/route/index");
app.use(router);

app.use(router)

app.use(itemRouter)


const PORT = process.env.PORT;

app.listen(PORT, () => {

  console.log(`Server running on https://localhost: ${PORT}`);
});




