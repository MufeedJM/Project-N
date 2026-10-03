import { CartItem, CustomerInfo, Order, OrderItem, PaymentMethod } from '../types';
import { BRAND_CONFIG } from '../data/products';

const ORDERS_STORAGE_KEY = 'ceylon_seeds_orders';

class OrderService {
  private getStoredOrders(): Order[] {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading orders from localStorage', e);
    }
    return [];
  }

  private saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders to localStorage', e);
    }
  }

  public getAll(): Order[] {
    return this.getStoredOrders();
  }

  public getById(id: string): Order | undefined {
    return this.getStoredOrders().find((o) => o.id === id || o.orderNumber === id);
  }

  public createOrder(
    customer: CustomerInfo,
    cartItems: CartItem[],
    subtotal: number,
    deliveryFee: number,
    paymentMethod: PaymentMethod,
    paymentStatus: Order['paymentStatus']
  ): Order {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SLS-2026-${randomSuffix}`;

    const items: OrderItem[] = cartItems.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      variety: item.product.variety,
      quantity: item.quantity,
      unitPrice: item.product.price,
      totalPrice: item.product.price * item.quantity,
      image: item.product.image,
    }));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer,
      items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      paymentMethod,
      paymentStatus,
      orderStatus: 'Processing',
      specialNotes: customer.notes?.trim() || undefined,
    };

    const existingOrders = this.getStoredOrders();
    this.saveOrders([newOrder, ...existingOrders]);
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: Order['orderStatus']): Order | undefined {
    const orders = this.getStoredOrders();
    const index = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (index !== -1) {
      orders[index].orderStatus = status;
      this.saveOrders(orders);
      return orders[index];
    }
    return undefined;
  }

  public generateWhatsAppOrderMessage(order: Order): string {
    const itemsSummary = order.items
      .map((i) => `• ${i.productName} (${i.variety}) x${i.quantity} = LKR ${i.totalPrice.toLocaleString()}`)
      .join('\n');

    const message = 
`🌱 *NEW ORDER CONFIRMATION* - ${BRAND_CONFIG.brandName}
*Order Number:* ${order.orderNumber}
*Date:* ${new Date(order.createdAt).toLocaleDateString('en-GB')}

*Customer:* ${order.customer.fullName}
*Phone:* ${order.customer.phone}
*Delivery Address:* ${order.customer.address}, ${order.customer.city}, ${order.customer.district}

*Items Ordered:*
${itemsSummary}

*Subtotal:* LKR ${order.subtotal.toLocaleString()}
*Delivery Fee:* LKR ${order.deliveryFee.toLocaleString()}
*Total Amount:* LKR ${order.total.toLocaleString()}
*Payment Method:* ${order.paymentMethod.toUpperCase()} (${order.paymentStatus})
${order.specialNotes ? `*Special Notes:* ${order.specialNotes}` : ''}

Thank you for cultivating with FLORA SEEDS Sri Lanka! 🇱🇰`;

    return encodeURIComponent(message);
  }

  public getWhatsAppUrl(order: Order): string {
    const encoded = this.generateWhatsAppOrderMessage(order);
    const cleanPhone = BRAND_CONFIG.whatsapp.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  }
}

export const orderService = new OrderService();
