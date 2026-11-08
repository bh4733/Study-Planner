import Datastore from "nedb-promises";

export const taskDB = Datastore.create({
  filename: "./db/tasks.db",
  autoload: true,
});

export const userDB = Datastore.create({
  filename: "./db/users.db",
  autoload: true,
});
