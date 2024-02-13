import express from "express";
import { config } from "dotenv";
import db_connection from "./DB/connection.js";
import userRouter from "./src/modules/Users/user.routes.js";
import messageRouter from "./src/modules/Messages/message.routes.js";
import { globalResponse } from "./src/middlewares/globalResponse.js";
import { rollbackSavedDocuments } from "./src/middlewares/rollback-saved-Documents.js";
import { rollbackUploadedFiles } from "./src/middlewares/rollback-uploaded-files.middleware.js";

config({ path: "./config/dev.config.env" });

const app = express();

app.use(express.json());
app.use("/user", userRouter);
app.use("/message", messageRouter);

app.use(globalResponse, rollbackUploadedFiles, rollbackSavedDocuments);

db_connection();
app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});
