class Order {
    constructor(
        public address: string, 
        public number: number, 
        public optionalAddress: string, 
        public paymentOption: string, 
        public orderItems: OrderItem[] = [],
        public _id?: string,
        public user?: string,
        public total?: number,
        public restaurant?: string,
    ) {}
}

class OrderItem {
    constructor(public quantity: number, public menu: string){}
}

export { Order, OrderItem}