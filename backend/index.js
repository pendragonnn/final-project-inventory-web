const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv");
dotenv.config();

app.use("/test", (req, res) => {
    res.send("hello world");
  });

app.listen(PORT, () => {
    console.log(`app Running in localhost:${PORT}`);
});