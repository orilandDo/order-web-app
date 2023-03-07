export interface Order {
    id: number;
    createdDate: string, // Ngày tạo đơn
    deliveryId: number, // Nơi nhận hàng
    pickupId: number, // Nơi giao hàng
    productTotal: number,
    transport: number, // Phương tiện vận chuyển (1: bộ, 2: thủy, 3: hàng không)
    licensePlates: string, // Biển số
    driver: string,
    receivedDate: string,
    note: string,
    status: number,
    contract: string,
    products: ProductItem[],
    selectedDelivery?: string,
    selectedPickup?: string,
    selectedTransport?: string,
    statusLabel?: string,
    updatedDate?: string,
    agencyId?: number,
    agencyName?: string,
}

export interface ProductItem {
    id: number,
    name: string,
    quantity: number,
}