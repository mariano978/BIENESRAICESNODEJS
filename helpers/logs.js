import chalk from "chalk";

//objetos a JSON strings
const stringObj = (obj) => {
  return JSON.stringify(obj, null, 2);
};

export { chalk, stringObj };
