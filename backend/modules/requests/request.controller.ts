import { UserService } from './../users/user.service';
import { RequestService } from './request.service';
import express, { response } from 'express';
import { Request } from './models/request.entity';

export class RequestController {
    private requestService = new RequestService();
    private userService: UserService;
    private distLimit: number = 5;
    public path = "/request";
    public router = express.Router();

    constructor(userService: UserService){
        this.initialiseRoutes();
        this.requestService = new RequestService();
        this.userService = userService;
    }

    private initialiseRoutes(){
        this.router.post('/create', async (req, res) => {
            console.log(req.body);
            let id = await this.userService.getUserIdfromToken(req.body.token);
            if(!id)
                return res.json({message: "Not logged in"});
            return res.json(await this.requestService.createRequest(id, req.body.requestBody));
        });
        this.router.post('/getall', async (req, res) => {
            let requests: Request[] = await this.requestService.getRequests();
            let postcode = (await this.userService.getUserDetail(await this.userService.getUserIdfromToken(req.body.token))).post_code;            

            let response = [];
            for(let request of requests){
                let postcode2 = (await this.userService.getUserDetail(request.customerID)).post_code;
                let dist = (await this.requestService.checkPostCodeDistance(postcode, postcode2)).distance;
                if(dist < this.distLimit)
                    response.push(request);

            }
            return res.json(response);
        });
        this.router.post('/getcurrent', async (req, res) => {
            console.log(req.body);
            return res.json(await this.requestService.getRequestsOfId(await this.userService.getUserIdfromToken(req.body.token)));
        });
        this.router.post('/distcheck', async (req, res) => {
            return res.json(await this.requestService.checkPostCodeDistance(req.body.post1, req.body.post2));
        });
        this.router.post('/accept', async (req, res) => {
            console.log(req.body);
            console.log(await this.userService.getUserIdfromToken(req.body.token));
            return res.json(await this.requestService.acceptRequest(Number(req.body.requestId), await this.userService.getUserIdfromToken(req.body.token)));
        });
        this.router.post('/fulfill', async (req, res) => {
            // console.log();
            return res.json(await this.requestService.fulfillRequest(Number(req.body.requestId)));
        });
    }
}