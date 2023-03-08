import { Injectable } from "@nestjs/common";
import { AgencyService } from "../agency/agency.service";
import { MenuService } from "../menu/menu.service";
import { UserService } from "../user/user.service";
import { AuthDto } from "./dto/auth.dto";
import { User } from "./entities/user.entity";
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
    jwtSecret: string = 'SECRET_STRING';

    constructor(private readonly userService: UserService,
        private readonly menuService: MenuService,
        private readonly agencyService: AgencyService,
        ) { }

    async login(user: AuthDto) {
        const userEntity = await this.userService.findByNamePassword(user.username, user.password);
        console.log(userEntity)
        if (userEntity) {
            const menuList = await this.menuService.findAll();
            const agency = await this.agencyService.findOne(userEntity.id);
            const userList = await this.userService.findAll();
            console.log(agency)
            return {
                code: 200, data: {
                    menuList,
                    loginInfo: {
                        isAdmin: userEntity.isAdmin,
                        accountName: agency.fullName
                    },
                    userList,
                    jwt: '1'
                }
            };
        } else {
            return { code: 401, data: null };
        }

    }

    generateAccessAuthToken(username) {
        return new Promise((resolve, reject) => {
            // Create the JSON Web Token and return that
            jwt.sign({ _id: username.toHexString() }, this.jwtSecret, { expiresIn: "30m" }, (err, token) => {
                if (!err) {
                    resolve(token);
                } else {
                    // there is an error
                    reject();
                }
            })
        })
    }
}