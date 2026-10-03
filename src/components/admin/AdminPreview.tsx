import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { seedService } from '../../services/seedService';
import { orderService } from '../../services/orderService';
import { inquiryService } from '../../services/inquiryService';
import { Product, Order, QuestionInquiry, ProductCategory } from '../../types';
import { CATEGORIES, BRAND_CONFIG } from '../../data/products';
import { PAYHERE_CONFIG, BANK_DETAILS } from '../../services/paymentGateway';
import {
  ArrowLeft,
  Package,
  ShoppingBag,
  HelpCircle,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const AdminPreview: React.FC = () => {
  const { navigateToHome, addToast } = useStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'inquiries' | 'gateway'>(
    'inventory'
  );

  // Live state from services
  const [products, setProducts] = useState<Product[]>(() => seedService.getAll());
  const [orders, setOrders] = useState<Order[]>(() => orderService.getAll());
  const [inquiries, setInquiries] = useState<QuestionInquiry[]>(() => inquiryService.getAll());

  // Editing state for quick stock update
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempStock, setTempStock] = useState<number>(0);

  const startEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setTempPrice(prod.price);
    setTempStock(prod.stock);
  };

  const saveProductEdit = (product: Product) => {
    const updated = { ...product, price: tempPrice, stock: tempStock };
    seedService.updateProduct(updated);
    setProducts(seedService.getAll());
    setEditingProductId(null);
    addToast('Updated', `${product.name} price and stock updated.`, 'success');
  };

  const handleStatusChange = (orderId: string, status: Order['orderStatus']) => {
    orderService.updateOrderStatus(orderId, status);
    setOrders(orderService.getAll());
    addToast('Order Status Updated', `Order ${orderId} marked as ${status}.`, 'info');
  };

  const handleResetCatalog = () => {
    seedService.resetToDefaults();
    setProducts(seedService.getAll());
    addToast('Reset to Defaults', 'Inventory restored to original Sri Lankan seed catalog.', 'info');
  };

  return (
    <div className="min-h-screen bg-earth-50/70 pb-20">
      {/* Admin Top Bar */}
      <header className="bg-charcoal-900 text-white border-b border-charcoal-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={navigateToHome}
              className="p-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-agro-200 transition"
              title="Return to Customer Storefront"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-white">
                  FLORA SEEDS Admin Hub
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30">
                  Ready Architecture
                </span>
              </div>
              <p className="text-xs text-agro-200/70">
                Manage live seed inventory, customer orders, inquiries, &amp; payment gateway
              </p>
            </div>
          </div>

          <button
            onClick={navigateToHome}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-agro-700 hover:bg-agro-600 text-white text-xs font-bold transition"
          >
            <span>Back to Storefront</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 border-t border-charcoal-800 pt-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'inventory'
                ? 'border-agro-400 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Seed Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'orders'
                ? 'border-agro-400 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'inquiries'
                ? 'border-agro-400 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Agricultural Questions ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gateway')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'gateway'
                ? 'border-agro-400 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Gateway &amp; API Integration</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-charcoal-900 font-display">
                  Live Seed Products &amp; Stock
                </h2>
                <p className="text-xs text-charcoal-800/70 mt-0.5">
                  Products are stored in database-ready local storage. Changes immediately reflect in
                  the online store.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCatalog}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-earth-200 text-charcoal-800 text-xs font-semibold hover:bg-earth-100 transition"
                  title="Reset to default seed variety list"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Defaults</span>
                </button>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-3xl border border-agro-100 shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-charcoal-900 divide-y divide-earth-100">
                  <thead className="bg-earth-50/70 text-[11px] font-bold uppercase tracking-wider text-charcoal-800">
                    <tr>
                      <th className="py-3.5 px-4">Product / Variety</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Pack Size</th>
                      <th className="py-3.5 px-4">Price (LKR)</th>
                      <th className="py-3.5 px-4">Stock (Packets)</th>
                      <th className="py-3.5 px-4">Germination</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-earth-100">
                    {products.map((prod) => {
                      const isEditing = editingProductId === prod.id;
                      return (
                        <tr key={prod.id} className="hover:bg-agro-50/30 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-10 h-10 rounded-xl object-cover bg-earth-100 flex-shrink-0"
                              />
                              <div>
                                <span className="font-bold text-charcoal-900 block">{prod.name}</span>
                                <span className="text-[11px] text-agro-700 font-semibold">
                                  {prod.variety}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-earth-100 text-charcoal-800 text-[10px] font-semibold">
                              {prod.category}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-medium">
                            {prod.quantity} {prod.unit}
                          </td>

                          <td className="py-3 px-4 font-bold">
                            {isEditing ? (
                              <input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(Number(e.target.value))}
                                className="w-20 px-2 py-1 border rounded bg-white"
                              />
                            ) : (
                              <span>LKR {prod.price.toLocaleString()}</span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            {isEditing ? (
                              <input
                                type="number"
                                value={tempStock}
                                onChange={(e) => setTempStock(Number(e.target.value))}
                                className="w-20 px-2 py-1 border rounded bg-white"
                              />
                            ) : (
                              <span
                                className={`font-semibold ${
                                  prod.stock <= 20 ? 'text-amber-600' : 'text-emerald-700'
                                }`}
                              >
                                {prod.stock} pkts
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 font-medium text-emerald-700">
                            {prod.germinationRate}% Viable
                          </td>

                          <td className="py-3 px-4 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => saveProductEdit(prod)}
                                  className="px-2.5 py-1 rounded bg-agro-700 text-white font-bold hover:bg-agro-800"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingProductId(null)}
                                  className="px-2 py-1 rounded bg-gray-200 text-charcoal-800"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEditProduct(prod)}
                                className="inline-flex items-center gap-1 text-agro-700 hover:text-agro-900 font-semibold p-1"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-charcoal-900 font-display">
                Online Seed Orders &amp; Fulfillment
              </h2>
              <p className="text-xs text-charcoal-800/70 mt-0.5">
                Review incoming Sri Lankan customer orders, payment status, and dispatch tracking.
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-agro-100 p-8">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-charcoal-900">No orders placed yet</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Place a test order via checkout to view it registered here in real time.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-6 border border-agro-100 shadow-soft"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-earth-100 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-base text-agro-900">
                            #{order.orderNumber}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleString('en-GB')}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-charcoal-900 mt-0.5">
                          Customer: {order.customer.fullName} ({order.customer.phone})
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Order status selector */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-gray-500">Status:</span>
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                            className="px-2.5 py-1 rounded-lg border border-earth-200 text-xs font-bold bg-earth-50 text-charcoal-900"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>

                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-agro-100 text-agro-800 border border-agro-200">
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Delivery details & notes */}
                    <div className="py-4 text-xs text-charcoal-800 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-earth-100">
                      <div>
                        <span className="font-semibold text-gray-500 block">Delivery Address:</span>
                        <p>{order.customer.address}, {order.customer.city}, {order.customer.district} ({order.customer.postalCode})</p>
                      </div>

                      <div>
                        <span className="font-semibold text-gray-500 block">Payment &amp; Total:</span>
                        <p>
                          Method: <strong>{order.paymentMethod.toUpperCase()}</strong> • Grand Total:{' '}
                          <strong className="text-agro-900">LKR {order.total.toLocaleString()}</strong>
                        </p>
                        {order.specialNotes && (
                          <p className="mt-1 text-agro-800 italic">Notes: "{order.specialNotes}"</p>
                        )}
                      </div>
                    </div>

                    {/* Ordered items breakdown */}
                    <div className="pt-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                        Seed Packets:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item) => (
                          <span
                            key={item.productId}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-earth-50 border border-earth-200 text-xs text-charcoal-900"
                          >
                            <strong>{item.productName}</strong> ({item.variety}) x{item.quantity} = LKR {item.totalPrice}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CUSTOMER INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-charcoal-900 font-display">
                Customer Agricultural Questions
              </h2>
              <p className="text-xs text-charcoal-800/70 mt-0.5">
                Questions submitted from the "Have a Question About Our Seeds?" form on the storefront.
              </p>
            </div>

            <div className="space-y-4">
              {inquiries.length === 0 ? (
                <p className="text-sm text-charcoal-800/70">No questions submitted yet.</p>
              ) : inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-white rounded-3xl p-6 border border-agro-100 shadow-soft"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-earth-100 gap-2">
                    <div>
                      <div className="text-xs text-gray-500">
                        {inq.phone && <span> • Phone: {inq.phone}</span>}
                      </div>
                    </div>

                    <span className="text-xs text-gray-400">
                      {new Date(inq.submittedAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>

                  <div className="pt-3 text-xs sm:text-sm text-charcoal-800">
                    {inq.varietyInterest && (
                      <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-agro-50 text-agro-800 border border-agro-200 mb-2">
                        Variety Interested: {inq.varietyInterest}
                      </span>
                    )}
                    <p className="leading-relaxed bg-earth-50/60 p-4 rounded-2xl border border-earth-200/50">
                      "{inq.message}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GATEWAY & BACKEND INTEGRATION */}
        {activeTab === 'gateway' && (
          <div className="space-y-8 max-w-4xl">
            <div>
              <h2 className="text-2xl font-bold text-charcoal-900 font-display">
                Sri Lanka Payment Gateway Architecture
              </h2>
              <p className="text-xs text-charcoal-800/70 mt-0.5">
                Everything is cleanly structured so PayHere, Commercial Bank, or backend webhooks can be hooked up.
              </p>
            </div>

            {/* PayHere Integration Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agro-100 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-6 h-6 text-agro-700" />
                  <h3 className="text-lg font-bold text-charcoal-900 font-display">
                    PayHere Sri Lanka (CBSL Approved)
                  </h3>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900">
                  Ready for Live Merchant Key
                </span>
              </div>

              <p className="text-xs sm:text-sm text-charcoal-800/80 leading-relaxed">
                The frontend code has full parameters mapped in{' '}
                <code className="text-agro-800 font-mono bg-earth-100 px-1.5 py-0.5 rounded">
                  src/services/paymentGateway.ts
                </code>
                . When you receive your merchant ID from PayHere, simply supply it via{' '}
                <code>VITE_PAYHERE_MERCHANT_ID</code>.
              </p>

              <div className="p-4 rounded-2xl bg-earth-50 font-mono text-xs space-y-2 border border-earth-200">
                <div>
                  <strong>Configured Merchant ID:</strong> {PAYHERE_CONFIG.merchantId || '(Using Sandbox Simulator)'}
                </div>
                <div>
                  <strong>Environment:</strong> {PAYHERE_CONFIG.isSandbox ? 'Sandbox / Test Mode' : 'Production Live'}
                </div>
                <div>
                  <strong>Webhook Return URL:</strong> {PAYHERE_CONFIG.returnUrl}
                </div>
                <div>
                  <strong>Webhook Notify Endpoint:</strong> {PAYHERE_CONFIG.notifyUrl}
                </div>
              </div>
            </div>

            {/* Bank Transfer Setup Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agro-100 shadow-soft space-y-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-agro-700" />
                <h3 className="text-lg font-bold text-charcoal-900 font-display">
                  Corporate Bank Account Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-earth-50 border border-earth-200">
                  <span className="text-gray-500 block">Bank Name:</span>
                  <span className="font-bold text-charcoal-900">{BANK_DETAILS.bankName}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-earth-50 border border-earth-200">
                  <span className="text-gray-500 block">Account Number:</span>
                  <span className="font-mono font-bold text-agro-900 text-sm">
                    {BANK_DETAILS.accountNumber}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-earth-50 border border-earth-200">
                  <span className="text-gray-500 block">Branch:</span>
                  <span className="font-bold text-charcoal-900">{BANK_DETAILS.branch}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-earth-50 border border-earth-200">
                  <span className="text-gray-500 block">WhatsApp Slip Verification:</span>
                  <span className="font-bold text-emerald-700">
                    {BANK_DETAILS.whatsappConfirmation}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
