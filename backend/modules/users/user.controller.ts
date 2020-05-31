import { UserService } from './user.service';
import multiparty from 'multiparty';
import express from 'express';



export class UserController {
    private userService: UserService;
    public path = "/user";
    public router = express.Router();

    constructor(){
        this.initialiseRoutes();
        this.userService = new UserService();
    }

    private initialiseRoutes(){
        this.router.post('/login', async (req, res) => {
            console.log("log");
            console.log(req.body);
            return res.json(await this.userService.login(req.body));
        });
        this.router.post('/register', async (req, res) => {
            console.log("reg");
            console.log(req.body);
            return res.json(await this.userService.register(req.body));
        });
        this.router.post('/logout', async (req, res) => {
            return res.json(await this.userService.logout(req.body.token));
        })
    }

    public getUserService(): UserService{
        return this.userService;
    }
}