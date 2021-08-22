const User = require("../model/user");
const Admin = require("../model/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//err message

const errMsg = "<h2> PAGE NOT FOUND (404) </h2>";

//default admin
const createAdmin = async () => {
  await Admin.deleteMany({});
  await new Admin({ password: process.env.ADMIN_PASS, token: "" }).save();
};
createAdmin();

const validateAdmin = async (req) => {
  try {
    let admin = await Admin.find({});
    if (admin.length > 1) return false;
    admin = admin[0];
    if (req && req.params.token !== admin.token) return false;

    return admin;
  } catch (err) {
    console.log(err);
  }
};

const postMessage = async (req, res) => {
  try {
    const { message, name, email } = req.body;

    if (!message || !name || !email) throw new Error("invalid Inputs");

    const user = new User({ message, name, email });

    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send({ type: "error", message: err.message });
  }
};

const getForm = async (req, res) => {
  try {
    if (req.query.key !== process.env.QUERY_KEY) return res.send(errMsg);

    const admin = await validateAdmin();
    if (!admin) return res.send(errMsg);

    const token = await jwt.sign({ _id: admin._id }, process.env.JWT_KEY);
    admin.token = await token;
    await admin.save();

    res.render("index", {
      token,
    });
  } catch (err) {
    console.log(err);
  }
};

const validAdmin = async (req, res) => {
  try {
    const admin = await validateAdmin(req);
    if (!admin) return res.send(errMsg);

    const isMatch = await bcrypt.compare(req.body.password, admin.password);
    if (!isMatch) return res.send(errMsg);

    const megs = await User.find({});

    res.render("messages", {
      megs,
      token: admin.token,
    });
  } catch (err) {
    console.log(err);
  }
};

const getMessages = async (req, res) => {
  try {
    const admin = await validateAdmin(req);
    if (!admin) return res.send(errMsg);

    const megs = await User.find({});

    res.render("messages", {
      megs,
      token: admin.token,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateAdminPass = async (req, res) => {
  try {
    const admin = await validateAdmin(req);
    if (!admin) return res.send(errMsg);

    if (req.body.bod !== process.env.BOD) return res.send(errMsg);

    admin.password = req.body.password;
    await admin.save();

    res.redirect(`/admin?key=mitesh`);
  } catch (err) {
    console.log(err);
  }
};

const getUpdateAdminForm = async (req, res) => {
  try {
    const admin = await validateAdmin(req);
    if (!admin) return res.send(errMsg);

    res.render("update", {
      token: admin.token,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteSingleMsg = async (req, res) => {
  try {
    const admin = await validateAdmin();
    if (!admin) return res.send(errMsg);

    await User.findByIdAndDelete({ _id: req.params.id });

    res.redirect(`/admin/${admin.token}`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getUpdateAdminForm,
  postMessage,
  getForm,
  validAdmin,
  updateAdminPass,
  deleteSingleMsg,
  getMessages,
};
