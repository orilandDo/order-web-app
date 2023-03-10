import { Injectable } from "@nestjs/common";
import { DeliveryService } from "../delivery/delivery.service";
import { AgencyService } from "../agency/agency.service";
import { MenuService } from "../menu/menu.service";
import { UserService } from "../user/user.service";
import { AuthDto } from "./dto/auth.dto";
import { ProductsService } from "../products/products.service";
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
    jwtSecret: string = 'SECRET_STRING';

    constructor(private readonly userService: UserService,
        private readonly menuService: MenuService,
        private readonly agencyService: AgencyService,
        private readonly deliveryService: DeliveryService,
        private readonly productService: ProductsService,
        ) { }

    async login(user: AuthDto) {
        const userEntity = await this.userService.findByNamePassword(user.username, user.password);
        console.log(userEntity)
        if (userEntity) {
            const menuList = await this.menuService.findAll(userEntity.isAdmin);
            let userList = await this.userService.findAll();
            const deliveryList = await this.deliveryService.findAll();
            let agencyList = await this.agencyService.findAll();
            const agency = agencyList.find(x => x.userId === userEntity.id);
            const productList = await this.productService.findAll();
            const admin = userList.find(x => x.isAdmin === true);
            // khong lay du lieu admin
            agencyList = agencyList.filter(x => x.userId !== admin.id);
            userList = userList.filter(x => x.isAdmin === false);
            return {
                code: 200, data: {
                    loginInfo: {
                        isAdmin: userEntity.isAdmin,
                        accountName: agency.fullName,
                        agencyId: agency.id,
                    },
                    menuList,
                    userList,
                    deliveryList,
                    agencyList,
                    productList,
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