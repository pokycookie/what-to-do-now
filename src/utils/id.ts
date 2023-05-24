import { v4 } from "uuid";

export function makeUUID() {
  const uuid = v4();
  const tokens = uuid.split("-");
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
}

export function makeRandomID(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    counter += 1;
  }
  return result;
}
