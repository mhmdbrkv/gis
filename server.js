const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect("mongodb://127.0.0.1:27017/ProjectDrmahmoudGis")
  .then(() => console.log("DB connected successfully"));

app.listen(3000, () => {
  console.log("server now listen on port 3000");
});
