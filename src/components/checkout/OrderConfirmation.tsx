import React, { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { orderService } from '../../services/orderService';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  Phone,
  MessageSquare,
  ArrowRight,
  Printer,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const OrderConfirmation: React.FC = () => {
  const { lastCompletedOrder, navigateToHome, navigateToCatalog } = useStore();

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2f764c', '#52b788', '#f59e0b', '#dcceb1'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!lastCompletedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-charcoal-900 font-display">No recent order found</h2>
        <button
          onClick={navigateToHome}
          className="mt-4 px-6 py-2.5 rounded-xl bg-agro-700 text-white font-semibold text-sm"
        >
          Return Home
        </button>
      </div>
    );
  }

  const order = lastCompletedOrder;
  const whatsappUrl = orderService.getWhatsAppUrl(order);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Success Badge & Headline */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 border-4 border-emerald-200 shadow-soft animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agro-100 text-agro-800 text-xs font-bold mb-3 border border-agro-200">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>Cultivating Sri Lanka's Green Future</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 font-display">
          Order Confirmed!
        </h1>
        <p className="text-sm sm:text-base text-charcoal-800/80 mt-2 max-w-lg mx-auto">
          Thank you for choosing Ceylon Flora & Seeds. Your order has been registered and is being
          prepared for dispatch.
        </p>
      </div>

      {/* Main Order Receipt Card */}
      <div className="bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-10 border border-agro-100 shadow-soft-lg mb-8">
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-earth-100 gap-4">
          <div>
            <span className="text-xs text-gray-500 font-medium block">Order Number</span>
            <span className="text-xl sm:text-2xl font-black text-agro-900 font-mono tracking-wider">
              {order.orderNumber}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-gray-500 block">Date</span>
              <span className="font-semibold text-charcoal-900">
                {new Date(order.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Payment</span>
              <span className="font-bold text-agro-800 bg-agro-50 px-2 py-0.5 rounded border border-agro-200">
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery & Recipient Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-earth-100 text-xs sm:text-sm">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-agro-700" />
              Delivery Destination
            </span>
            <p className="font-bold text-charcoal-900 text-base">{order.customer.fullName}</p>
            <p className="text-charcoal-800/80 mt-0.5">{order.customer.address}</p>
            <p className="text-charcoal-800/80">
              {order.customer.city}, {order.customer.district} ({order.customer.postalCode})
            </p>
            <p className="text-charcoal-800/80 mt-1">Phone: {order.customer.phone}</p>
          </div>

          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-agro-700" />
              Courier Fulfillment Status
            </span>
            <p className="font-bold text-charcoal-900">Islandwide Express Courier</p>
            <p className="text-charcoal-800/80 mt-0.5">
              Estimated Delivery: <strong>2 - 3 Business Days</strong>
            </p>
            <p className="text-charcoal-800/80 mt-1">
              Hermetically packed in moisture-barrier seed foil to preserve germination vigor.
            </p>
            {order.specialNotes && (
              <div className="mt-2 p-2.5 rounded-xl bg-earth-50 border border-earth-200 text-xs italic">
                <strong>Your Notes:</strong> "{order.specialNotes}"
              </div>
            )}
          </div>
        </div>

        {/* Ordered Seed Items Table */}
        <div className="py-6 border-b border-earth-100">
          <h3 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider mb-4">
            Items in This Shipment
          </h3>
          <div className="divide-y divide-earth-100">
            {order.items.map((item) => (
              <div key={item.productId} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-12 h-12 rounded-xl object-cover bg-earth-100"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-charcoal-900">{item.productName}</h4>
                    <span className="text-xs text-agro-700 font-medium">
                      Variety: {item.variety}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">Qty: {item.quantity} pkts</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-charcoal-900">
                    LKR {item.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Totals */}
        <div className="pt-6 flex flex-col items-end">
          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-charcoal-800">
              <span>Subtotal:</span>
              <span className="font-semibold">LKR {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-charcoal-800">
              <span>Delivery Fee:</span>
              <span className="font-semibold">
                {order.deliveryFee === 0 ? 'FREE' : `LKR ${order.deliveryFee.toLocaleString()}`}
              </span>
            </div>
            <div className="pt-2 border-t border-earth-200 flex justify-between items-baseline font-bold">
              <span className="text-sm text-charcoal-900">Total Paid / Due:</span>
              <span className="text-xl text-agro-900 font-display">
                LKR {order.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* WhatsApp & Print Actions */}
        <div className="mt-8 pt-6 border-t border-earth-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-soft transition active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Notify Us on WhatsApp with Order Receipt</span>
          </a>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-earth-100 hover:bg-earth-200 text-charcoal-900 font-semibold text-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>

            <button
              onClick={() => navigateToCatalog('All')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-2xl bg-agro-700 hover:bg-agro-800 text-white font-semibold text-xs transition"
            >
              <span>Shop More Seeds</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
