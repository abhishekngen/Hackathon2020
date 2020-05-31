import { UserDetail } from './models/userdetail.entity';
import { User } from './models/user.entity';
import { getRepository } from 'typeorm';
import crypto from 'crypto';
export class UserService {
    private authtokens = {
        'testtoken': 10
    };

    async login(body: any): Promise<any>{
        let user = await getRepository(User).findOne({username: body.username});
        if(!user)
            return {message: "Cannot find user"};
        if(user.pass === body.pass){
            let token = this.generateAuthToken();
            this.authtokens[token] = user.id; 
            return {token: token, type: user.helper?"helper":"elderly"};
        }
        return {message: "Wrong password"};
    }

    async getUser(id: number): Promise<any> {
        let user = await getRepository(User).findOne({id: id});
        if(!user)
            return {message: "Cannot find user"};
        return user;
    }
    
    async logout(token: string): Promise<any>{
        console.log(this.authtokens[token]);
        if(!this.authtokens[token])
            return {message: "User not found"}
        delete this.authtokens[token];
        return {success: "Success"}
    }

    async isLoggedIn(token: string){
        if(!this.authtokens[token])
            return {message: "User not found"}
        delete this.authtokens[token];
        return {success: "Success"}
    }

    async getUserDetail(id: number): Promise<any> {
        let detail = await getRepository(UserDetail).findOne({user_id: id});
        if(!detail)
            return {message: "Cannot find userdetail"};
        return detail;
    }

    async register(body: any): Promise<any>{
        try {
            let res = await getRepository(User).insert({
                username: body.username,
                pass: body.pass,
                helper: !body.elderly
            });
            await getRepository(UserDetail).insert({
                user_id: res.identifiers[0].id,
                post_code: body.postcode,
                house_number: body.housenumber,
                address_line: body.streetname,
                full_name: body.fullname,
                mobile: body.phonenumber
            });
            let token = this.generateAuthToken();  
            this.authtokens[token] = res.identifiers[0].id;
            return {token: token, type: (!body.elderly)?"helper":"elderly"};
        }catch(err){
            console.log(err);
            return {message: "Try another username"}
        }
    }

    private generateAuthToken(): string{
        return crypto.randomBytes(30).toString('hex');
    }

    async getUserIdfromToken(token: string): Promise<any>{
        return this.authtokens[token];
    }
}