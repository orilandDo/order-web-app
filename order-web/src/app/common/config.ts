export const CONFIG = {
    SECRET_KEY: 'order-web-app-2023',
    BASE_URL: 'http://localhost:3000',
    URL: {
        LOGIN: 'auth/login',
        PRODUCT: 'products',
        SUM: 'products/sum',
        AGENCY: 'agency',
        ORDERS: {
            ORDER: 'orders',
            SEARCH: 'orders/search'
        },
        NOTIFICATION: 'notification',
        STATISTICS: 'statistics',
        DELIVERY: 'delivery',
        MENU: 'menu',
        USER: 'users'
    },
    SESSION_STORAGE: {
        ORDER_LIST: 'orderList',
        AGENCY_LIST: 'agencyList',
        PRODUCT_LIST: 'productList',
        PRODUCT_ORDER_LIST: 'productOrderList',
        USER_LIST: 'userList',
        DELIVERY_LIST: 'deliveryList',
        MENU_LIST: 'menuList',
        LOGIN_INFO: 'loginInfo',
        TOKEN: 'token',
        IS_ADMIN: 'is_admin',
        IS_LOGIN: 'is_login',
        JWT: 'jwt'
    }
}