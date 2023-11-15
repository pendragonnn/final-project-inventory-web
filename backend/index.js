const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const apiDocumentation = require("./src/doc/apidocs.json");
const router = require("./src/route/index");
const authRoutes = require("./src/route/auth.route");
dotenv.config();

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocumentation));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(authRoutes);
app.use(router);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on https://localhost: ${PORT}`);
});
