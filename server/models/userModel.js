import { userDB } from "../db/database.js";
import { v4 as uuidv4 } from "uuid";

export const createUser = async ({ username, password }) => {
  const existing = await userDB.findOne({ username });

  if (existing) throw new Error("User exists");

  const user = {
    _id: uuidv4(),
    username,
    password,
  };

  return userDB.insert(user);
};

export const findUser = ({ username }) => userDB.findOne({ username });
