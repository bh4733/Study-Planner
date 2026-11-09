import Datastore from "nedb-promises";
import path from "path";
import { fileURLToPath } from "url";

// Resolve the database files relative to this file, not to the folder Node was started in
const dbFolder = path.dirname(fileURLToPath(import.meta.url));

export const taskDB = Datastore.create({
  filename: path.join(dbFolder, "tasks.db"),
  autoload: true,
});

export const userDB = Datastore.create({
  filename: path.join(dbFolder, "users.db"),
  autoload: true,
});
