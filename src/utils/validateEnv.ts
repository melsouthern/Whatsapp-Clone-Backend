import { cleanEnv, str } from "envalid";

function validateEnv() {
  cleanEnv(process.env, {
    MONGO_USER: str(),
    MONGO_PASSWORD: str(),
    MONGO_URI: str(),
  });
}

export default validateEnv;
