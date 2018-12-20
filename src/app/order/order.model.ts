class Order {
    constructor(
        public address: string, 
        public number: number, 
        public optionalAddress: string, 
        public paymentOption: string, 
        public orderItems: OrderItem[] = [],
        public _id?: string
    ) {}
}

class OrderItem {
    constructor(public quantity: number, public menu_id: string){}
}

export { Order, OrderItem}