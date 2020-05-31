import { getRepository } from 'typeorm';
import { Request } from './models/request.entity';
import Axios from 'axios';
export class RequestService {
    async createRequest(customerID: number, requestBody: string){
        try {
            await getRepository(Request).insert({customerID, requestBody, fulfilled: false});    
            return {success: "Request submitted"};
        }catch(err){
            console.log(err);
            return {message: "Something went wrong"};
        }
    }

    async acceptRequest(requestID: number, helperID: number): Promise<any>{
        console.log(requestID);
        console.log(helperID);
        let req = await getRepository(Request).update({id: requestID}, {helperID: helperID});
        if(req.affected == 1)
            return {success: "Request accepted"}
        return {message: "Could not accept request"};
    }

    async fulfillRequest(requestID: number): Promise<any>{
        let req = await getRepository(Request).update({id: requestID}, {fulfilled: true});
        if(req.affected == 1)
            return {success: "Request fulfilled"}
        return {message: "Could not fulfill request"};
    }

    async getRequests(): Promise<any>{
        try{
            let requests: Request[] = await getRepository(Request).query("select * from request");
            return requests;
        }catch(err){
            return {message: "Something went wrong"};
        }
    }

    async getRequestsOfId(customerID: number): Promise<any>{
        try{
            console.log(`select * from request where customerID=${customerID}`);
            let requests: Request[] = await getRepository(Request).query(`select * from request where customerID=${customerID}`);
            console.log(requests);
            return requests;
        }catch(err){
            return {message: "Something went wrong"}
        }

    }

    async checkPostCodeDistance(postCode1: string, postCode2: string): Promise<any>{
        let p1 = (await Axios.get(`https://api.postcodes.io/postcodes?q=${postCode1}`)).data.result;
        let p2 = (await Axios.get(`https://api.postcodes.io/postcodes?q=${postCode2}`)).data.result;
        
        let post1 = {
            long: p1[0].longitude,
            lat: p1[0].latitude
        }
        let post2 = {
            long: p2[0].longitude,
            lat: p2[0].latitude
        }
        const a = Math.sin(((post2.lat - post1.lat) * Math.PI/180)/2) * Math.sin(((post2.lat - post1.lat) * Math.PI/180)/2) +
                Math.cos(post1.lat * Math.PI/180) * Math.cos(post2.lat * Math.PI/180) *
                Math.sin(((post2.long - post1.long) * Math.PI/180)/2) * Math.sin(((post2.long - post1.long) * Math.PI/180)/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = 6371e3 * c;

        return {distance: (d * 0.000621371)};
    }


}