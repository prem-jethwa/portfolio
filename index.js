require("./db/mongoose");

const express = require("express");
const cors = require("cors");
const {
  postMessage,
  getForm,
  validAdmin,
  updateAdminPass,
  getUpdateAdminForm,
  deleteSingleMsg,
  getMessages,
} = require("./controller/routers");

const app = express();
const hbs = require("hbs");
const path = require("path");

const port = process.env.PORT;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const publicDirPath = path.join(__dirname, "./public");
const viewDirPath = path.join(__dirname, "./template");
const partialsDirPath = path.join(__dirname, "./partials");

hbs.registerPartials(partialsDirPath);

app.set("view engine", "hbs");
app.set("views", viewDirPath);

app.use(express.static(publicDirPath));

// prevention
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");

 app.use(mongoSanitize());
app.use(helmet());
app.use(hpp());
app.use(xss());

//routers
app.post(
  "/msg",
  cors({
    origin: "https://premjethwa.com",
  }),
  postMessage
);

app.use(cors());
app.get("/admin", getForm);

app.get("/admin/update/:token", getUpdateAdminForm);
app.post("/admin/update/:token", updateAdminPass);
app.get("/admin/msg/:id", deleteSingleMsg);
app.post("/admin/:token", validAdmin);
app.get("/admin/:token", getMessages);

app.get("*", (req, res) => {
  res.send("<h2> PAGE NOT FOUND (404).</h2>");
});
app.listen(port, () => console.log(port));
