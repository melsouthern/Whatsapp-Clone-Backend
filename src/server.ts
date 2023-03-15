import App from "./app";
import GroupsController from "./groups/groups.controller";
import UsersController from "./users/users.controller";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App([new GroupsController(), new UsersController()], 6000);

app.listen();
