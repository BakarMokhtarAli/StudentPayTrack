import mongoose from "mongoose";
import { DbURL } from "./config.js";

const connect = mongoose
  .connect(DbURL)
  .then(() => {
    console.log(`database connected success`);
  })
  .catch((e) => {
    console.error(`Failed to connect database ${e}`);
  });

export default connect;
