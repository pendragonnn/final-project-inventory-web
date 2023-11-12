const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv");
dotenv.config();

const itemsRouter = require("./src/route/items");


app.listen(PORT, () => {
  console.log(`app Running in localhost:${PORT}`);
});



app.use(express.json());

app.use("/",itemsRouter);


