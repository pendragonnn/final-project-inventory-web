const express = require("express");;
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const itemRouter = require("./src/route/items")
const app = express();
dotenv.config()
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const router = require("./src/route/index")
app.use(router)
app.use(itemRouter)

const PORT = process.env.AppPORT 

app.listen(PORT, () => {
console.log(`Server running on https://localhost: ${PORT}`);
});
