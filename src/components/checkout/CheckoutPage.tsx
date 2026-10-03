import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { SRI_LANKA_DISTRICTS, BRAND_CONFIG } from '../../data/products';
import { CustomerInfo, PaymentMethod } from '../../types';
import { orderService } from '../../services/orderService';
import { PaymentGatewayService, BANK_DETAILS, PAYHERE_CONFIG } from '../../services/paymentGateway';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Building2,
  Banknote,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Lock,
  ChevronRight,
  Info,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { navigateToCatalog, setLastCompletedOrder, setActiveView, addToast } = useStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Customer form state
  const [formData, setFormData] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: 'Colombo',
    postalCode: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('payhere');

  // Handle field change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CustomerInfo]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid Email Address is required.';
    }
    const phoneClean = formData.phone.replace(/[\s-]/g, '');
    if (!phoneClean || phoneClean.length < 9) {
      newErrors.phone = 'Valid Sri Lankan Phone Number is required (e.g. 0771234567).';
    }
    if (!formData.address.trim()) newErrors.address = 'Delivery Address is required.';
    if (!formData.city.trim()) newErrors.city = 'City or Town is required.';
    if (!formData.district.trim()) newErrors.district = 'District is required.';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextToSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProceedToPayment = () => {
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 3 Final Submission
  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      addToast('Cart is empty', 'Please add seed varieties to your cart first.', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      let initialPaymentStatus: any = 'Pending';
      if (paymentMethod === 'cod') initialPaymentStatus = 'Cash On Delivery';
      if (paymentMethod === 'bank_transfer') initialPaymentStatus = 'Awaiting Slip';
      if (paymentMethod === 'payhere') {
        initialPaymentStatus = PaymentGatewayService.isLiveGatewayConfigured()
          ? 'Paid (Sandbox)'
          : 'Paid (Sandbox)';
      }

      // Create internal order record
      const order = orderService.createOrder(
        formData,
        items,
        subtotal,
        deliveryFee,
        paymentMethod,
        initialPaymentStatus
      );

      // Process payment through integration layer
      const paymentResult = await PaymentGatewayService.processPayment(paymentMethod, order, formData);

      setIsProcessing(false);

      if (paymentResult.success) {
        clearCart();
        setLastCompletedOrder(order);
        setActiveView('order-success');
        addToast('Order Placed Successfully!', `Order #${order.orderNumber} has been received.`, 'success');
      } else {
        addToast('Payment Error', paymentResult.message, 'error');
      }
    } catch (err: any) {
      setIsProcessing(false);
      addToast('Error', err.message || 'Failed to place order. Please try again.', 'error');
    }
  };

  if (items.length === 0 && currentStep === 1) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-agro-50 text-agro-700 flex items-center justify-center mx-auto mb-4 border border-agro-200">
          <Truck className="w-8 h-8 opacity-70" />
        </div>
        <h2 className="text-2xl font-bold text-charcoal-900 font-display">Your cart is empty</h2>
        <p className="text-sm text-charcoal-800/70 mt-2">
          Add some agricultural seeds to your shopping cart before proceeding to checkout.
        </p>
        <button
          onClick={() => navigateToCatalog('All')}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-agro-700 hover:bg-agro-800 text-white font-semibold text-sm shadow-soft transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Seeds Catalog</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => {
            if (currentStep > 1) setCurrentStep((s) => (s - 1) as any);
            else navigateToCatalog('All');
          }}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-agro-800 hover:text-agro-950 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentStep > 1 ? 'Back to Previous Step' : 'Return to Catalog'}</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-bit Encrypted Checkout</span>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-xl mx-auto relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-earth-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-agro-600 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
          />

          {/* Step 1 Pill */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                currentStep >= 1
                  ? 'bg-agro-700 text-white ring-4 ring-agro-100'
                  : 'bg-white text-gray-400 border border-gray-300'
              }`}
            >
              1
            </div>
            <span className="text-[11px] font-semibold text-charcoal-900 mt-1.5">
              Customer Info
            </span>
          </div>

          {/* Step 2 Pill */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                currentStep >= 2
                  ? 'bg-agro-700 text-white ring-4 ring-agro-100'
                  : 'bg-white text-gray-400 border border-gray-300'
              }`}
            >
              2
            </div>
            <span className="text-[11px] font-semibold text-charcoal-900 mt-1.5">
              Order Summary
            </span>
          </div>

          {/* Step 3 Pill */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                currentStep === 3
                  ? 'bg-agro-700 text-white ring-4 ring-agro-100'
                  : 'bg-white text-gray-400 border border-gray-300'
              }`}
            >
              3
            </div>
            <span className="text-[11px] font-semibold text-charcoal-900 mt-1.5">Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Step Flow Container (7 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-agro-100 shadow-soft">
          {/* STEP 1: CUSTOMER INFORMATION */}
          {currentStep === 1 && (
            <div>
              <div className="mb-6 pb-4 border-b border-earth-100">
                <h2 className="text-xl sm:text-2xl font-bold text-charcoal-900 font-display">
                  Step 1: Customer & Delivery Details
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-800/70 mt-1">
                  Please provide your contact info and Sri Lankan courier delivery address.
                </p>
              </div>

              <form onSubmit={handleNextToSummary} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Sunil Perera / Anuradha Jayasinghe"
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 ${
                      errors.fullName
                        ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200'
                        : 'border-earth-200 bg-earth-50/40 focus:ring-agro-500/20 focus:border-agro-600'
                    }`}
                  />
                  {errors.fullName && (
                    <span className="text-xs text-rose-500 mt-1 block">{errors.fullName}</span>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@gmail.com"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200'
                          : 'border-earth-200 bg-earth-50/40 focus:ring-agro-500/20 focus:border-agro-600'
                      }`}
                    />
                    {errors.email && (
                      <span className="text-xs text-rose-500 mt-1 block">{errors.email}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 mb-1">
                      Phone Number (Mobile) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 ${
                        errors.phone
                          ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200'
                          : 'border-earth-200 bg-earth-50/40 focus:ring-agro-500/20 focus:border-agro-600'
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-xs text-rose-500 mt-1 block">{errors.phone}</span>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Delivery Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. No. 45/A, Temple Road, Digana"
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 ${
                      errors.address
                        ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200'
                        : 'border-earth-200 bg-earth-50/40 focus:ring-agro-500/20 focus:border-agro-600'
                    }`}
                  />
                  {errors.address && (
                    <span className="text-xs text-rose-500 mt-1 block">{errors.address}</span>
                  )}
                </div>

                {/* City, District & Postal Code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 mb-1">
                      City / Town <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Kandy / Colombo"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 ${
                        errors.city
                          ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200'
                          : 'border-earth-200 bg-earth-50/40 focus:ring-agro-500/20 focus:border-agro-600'
                      }`}
                    />
                    {errors.city && (
                      <span className="text-xs text-rose-500 mt-1 block">{errors.city}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 mb-1">
                      District (Sri Lanka) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-earth-200 bg-earth-50/40 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-agro-500/20 focus:border-agro-600"
                    >
                      {SRI_LANKA_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 mb-1">
                      Postal Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="e.g. 20000"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 ${
                        errors.postalCode
                          ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200'
                          : 'border-earth-200 bg-earth-50/40 focus:ring-agro-500/20 focus:border-agro-600'
                      }`}
                    />
                    {errors.postalCode && (
                      <span className="text-xs text-rose-500 mt-1 block">{errors.postalCode}</span>
                    )}
                  </div>
                </div>

                {/* Section 6: Additional Notes */}
                <div className="pt-4 border-t border-earth-100">
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Additional Notes <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Have any special instructions or requests? Let us know... (e.g. delivery directions, landmark near house, specific planting inquiry)"
                    className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50/40 text-xs sm:text-sm text-charcoal-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-agro-500/20 focus:border-agro-600"
                  />
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    You can add special requests regarding your seed shipment or delivery instructions.
                  </span>
                </div>

                {/* Submit Step 1 Button */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-agro-700 hover:bg-agro-800 text-white font-bold text-sm shadow-soft transition active:scale-95"
                  >
                    <span>Continue to Order Summary</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: ORDER SUMMARY */}
          {currentStep === 2 && (
            <div>
              <div className="mb-6 pb-4 border-b border-earth-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-charcoal-900 font-display">
                    Step 2: Review Your Order
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal-800/70 mt-1">
                    Please confirm the selected seed varieties and recipient delivery address.
                  </p>
                </div>
              </div>

              {/* Recipient summary card */}
              <div className="p-4 rounded-2xl bg-agro-50/60 border border-agro-200/60 mb-6 text-xs sm:text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-agro-900">Delivery Recipient:</span>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-agro-700 font-semibold text-xs hover:underline"
                  >
                    Edit Information
                  </button>
                </div>
                <p className="font-semibold text-charcoal-900">{formData.fullName}</p>
                <p className="text-charcoal-800">{formData.address}, {formData.city}, {formData.district} ({formData.postalCode})</p>
                <p className="text-charcoal-800">Phone: {formData.phone} • Email: {formData.email}</p>
                {formData.notes && (
                  <p className="mt-2 pt-2 border-t border-agro-200/60 text-agro-900 text-xs italic">
                    <strong>Special Instructions:</strong> "{formData.notes}"
                  </p>
                )}
              </div>

              {/* Items List */}
              <div className="divide-y divide-earth-100 mb-6">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="py-3 flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover bg-earth-100 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-charcoal-900">{product.name}</h4>
                      <span className="text-xs text-agro-700 font-medium">
                        Variety: {product.variety}
                      </span>
                      <div className="text-xs text-gray-500">
                        Qty: {quantity} packet(s) • {product.quantity} {product.unit} each
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-charcoal-900">
                        LKR {(product.price * quantity).toLocaleString()}
                      </span>
                      <span className="block text-[11px] text-gray-500">
                        (LKR {product.price} ea)
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-earth-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 text-xs font-semibold text-charcoal-800 hover:text-agro-800"
                >
                  Back to Details
                </button>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-agro-700 hover:bg-agro-800 text-white font-bold text-sm shadow-soft transition active:scale-95"
                >
                  <span>Proceed to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT INTEGRATION READY */}
          {currentStep === 3 && (
            <div>
              <div className="mb-6 pb-4 border-b border-earth-100">
                <h2 className="text-xl sm:text-2xl font-bold text-charcoal-900 font-display">
                  Step 3: Select Payment Method
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-800/70 mt-1">
                  Choose how you would like to complete your order.
                </p>
              </div>

              {/* Payment Methods Selection */}
              <div className="space-y-3 mb-6">
                {/* PayHere / Credit / Debit Online */}
                <label
                  className={`block p-4 rounded-2xl border-2 transition cursor-pointer ${
                    paymentMethod === 'payhere'
                      ? 'border-agro-600 bg-agro-50/50 shadow-xs'
                      : 'border-earth-200 hover:border-agro-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="payhere"
                      checked={paymentMethod === 'payhere'}
                      onChange={() => setPaymentMethod('payhere')}
                      className="mt-1 text-agro-700 focus:ring-agro-500 accent-agro-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-charcoal-900 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-agro-700" />
                          PayHere Sri Lanka / Visa / Mastercard / Genie
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-100 text-gold-800 px-2 py-0.5 rounded">
                          Online Gateway
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-800/70 mt-1">
                        Secure instant payment gateway certified by the Central Bank of Sri Lanka (CBSL).
                      </p>

                      {/* Developer / Gateway Architecture Notice */}
                      <div className="mt-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="leading-relaxed">
                            <strong>Payment Gateway Integration Ready:</strong>{' '}
                            {PaymentGatewayService.isLiveGatewayConfigured() ? (
                              <span>Connected to Merchant ID: {PAYHERE_CONFIG.merchantId}</span>
                            ) : (
                              <span>
                                PayHere SDK &amp; Webhook parameters are pre-architected in{' '}
                                <code>src/services/paymentGateway.ts</code>. Currently running in
                                transparent Sandbox Simulator mode so you can test placing real orders without dummy card charging.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Direct Bank Transfer */}
                <label
                  className={`block p-4 rounded-2xl border-2 transition cursor-pointer ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-agro-600 bg-agro-50/50 shadow-xs'
                      : 'border-earth-200 hover:border-agro-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1 text-agro-700 focus:ring-agro-500 accent-agro-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-charcoal-900 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-agro-700" />
                          Direct Bank Wire / Online Banking Transfer
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-earth-200 text-charcoal-800 px-2 py-0.5 rounded">
                          Commercial Bank
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-800/70 mt-1">
                        Transfer to our Commercial Bank account and send the transfer slip via WhatsApp for instant dispatch.
                      </p>

                      {paymentMethod === 'bank_transfer' && (
                        <div className="mt-3 p-3.5 rounded-xl bg-white border border-agro-200 text-xs space-y-1 text-charcoal-900">
                          <div><strong>Bank:</strong> {BANK_DETAILS.bankName}</div>
                          <div><strong>Account Name:</strong> {BANK_DETAILS.accountName}</div>
                          <div><strong>Account Number:</strong> <span className="font-mono font-bold text-agro-800">{BANK_DETAILS.accountNumber}</span></div>
                          <div><strong>Branch:</strong> {BANK_DETAILS.branch}</div>
                          <div><strong>WhatsApp Slip To:</strong> {BANK_DETAILS.whatsappConfirmation}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`block p-4 rounded-2xl border-2 transition cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-agro-600 bg-agro-50/50 shadow-xs'
                      : 'border-earth-200 hover:border-agro-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 text-agro-700 focus:ring-agro-500 accent-agro-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-charcoal-900 flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-emerald-700" />
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          Islandwide
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-800/70 mt-1">
                        Pay cash directly to the courier rider upon delivery to your doorstep anywhere in Sri Lanka.
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Final Complete Order Button */}
              <div className="pt-4 border-t border-earth-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 text-xs font-semibold text-charcoal-800 hover:text-agro-800"
                >
                  Back to Summary
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-agro-700 hover:bg-agro-800 text-white font-bold text-sm shadow-soft hover:shadow-soft-lg transition active:scale-95 disabled:bg-gray-400"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Place Seed Order (LKR {total.toLocaleString()})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-earth-50/70 rounded-3xl p-6 border border-earth-200/80 sticky top-24">
          <h3 className="text-base font-bold text-charcoal-900 font-display mb-4 pb-3 border-b border-earth-200">
            Order Breakdown
          </h3>

          <div className="space-y-3 text-xs mb-4">
            <div className="flex justify-between text-charcoal-800">
              <span>Items Total ({items.length} varieties)</span>
              <span className="font-semibold">LKR {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-charcoal-800">
              <span>Islandwide Courier Fee</span>
              <span className="font-semibold">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-700 font-bold">FREE</span>
                ) : (
                  `LKR ${deliveryFee.toLocaleString()}`
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-earth-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-charcoal-900">Grand Total</span>
              <div className="text-right">
                <span className="text-xs font-bold text-agro-800 mr-1">LKR</span>
                <span className="text-2xl font-extrabold text-charcoal-950 font-display">
                  {total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-agro-100 text-xs text-charcoal-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-agro-900">
              <ShieldCheck className="w-4 h-4 text-agro-700" />
              <span>Certified Sri Lankan Seeds Guarantee</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Hermetically sealed with laboratory viability tests. Orders dispatch within 24-48 hours via registered express courier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
