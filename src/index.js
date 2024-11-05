const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json());
routes(app);
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("Conect DB success");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log("Sever is running in port", +port);
});
