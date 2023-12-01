const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const apiDocumentation = require("./src/doc/apidocs.json");
const router = require("./src/route/index");
const authRoutes = require("./src/route/auth.route");
const cors = require("cors");
dotenv.config();

const app = express();

app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocumentation));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1", authRoutes);
app.use("/api/v1", router);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on https://localhost: ${PORT}`);
});
