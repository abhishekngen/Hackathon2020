import { RequestController } from './modules/requests/request.controller';
import { UserController } from './modules/users/user.controller';
import express from 'express';
import { createConnection } from 'typeorm';
import bodyparser from 'body-parser';
const app = express();

const userController: UserController = new UserController();

const controllers = [
    userController,
    new RequestController(userController.getUserService())
]

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

app.use(bodyparser.json()); 

app.use(bodyparser.urlencoded({ extended: true })); 

controllers.forEach((controller) => {
    app.use(controller.path, controller.router);
});

createConnection();

app.listen(6032, () => console.log("hello"));