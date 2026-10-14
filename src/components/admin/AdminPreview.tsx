import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { seedService } from '../../services/seedService';
import { orderService } from '../../services/orderService';
import { inquiryService } from '../../services/inquiryService';
import { Product, Order, QuestionInquiry, ProductCategory } from '../../types';
import { CATEGORIES, FERTILIZER_CATEGORIES, BRAND_CONFIG } from '../../data/products';
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
  LockKeyhole,
  LogOut,
} from 'lucide-react';

export const AdminPreview: React.FC = () => {
  const { navigateToHome, addToast } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'inventory' | 'fertilizer' | 'tools' | 'orders' | 'inquiries' | 'gateway'
  >('inventory');

  // Live state from services
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => orderService.getAll());
  const [inquiries, setInquiries] = useState<QuestionInquiry[]>(() => inquiryService.getAll());

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { token } = await seedService.login(username, password);
      let importError: unknown;
      try {
        await seedService.importLegacyInventory(token);
      } catch (error) {
        importError = error;
      }

      setProducts(await seedService.getAll());
      setAdminToken(token);
      setIsAuthenticated(true);
      setLoginError('');
      setPassword('');
      if (importError) {
        addToast(
          'Existing Inventory Not Imported',
          importError instanceof Error ? importError.message : 'The saved inventory could not be imported.',
          'error'
        );
      }
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Unable to sign in to the admin service.');
      setPassword('');
    }
  };

  const requireAdminToken = () => {
    if (!adminToken) throw new Error('Admin sign-in expired. Please sign in again.');
    return adminToken;
  };

  const uploadProductPhoto = async (file: File) => {
    try {
      return await seedService.uploadImage(file, requireAdminToken());
    } catch (error) {
      addToast(
        'Photo Upload Failed',
        error instanceof Error ? error.message : 'The photo could not be uploaded.',
        'error'
      );
      return null;
    }
  };

  const inventoryProducts = products.filter(
    (prod) =>
      prod.inventoryType === 'Seed' ||
      (!prod.inventoryType &&
        prod.category !== 'Fertilizer' &&
        !FERTILIZER_CATEGORIES.includes(prod.category) &&
        prod.category !== 'Tools')
  );
  const fertilizerProducts = products.filter(
    (prod) =>
      prod.inventoryType === 'Fertilizer' ||
      prod.category === 'Fertilizer' ||
      FERTILIZER_CATEGORIES.includes(prod.category)
  );
  const toolProducts = products.filter(
    (prod) => prod.inventoryType === 'Tool' || prod.category === 'Tools'
  );

  // Editing state for inventory details
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempStock, setTempStock] = useState<number>(0);
  const [tempImage, setTempImage] = useState('');
  const [tempVariety, setTempVariety] = useState('');
  const [tempDescription, setTempDescription] = useState('');
  const [tempCategory, setTempCategory] = useState<ProductCategory>('Vegetable Seeds');
  const [tempQuantity, setTempQuantity] = useState<number>(1);
  const [tempUnit, setTempUnit] = useState('');
  const [tempWeight, setTempWeight] = useState<number>(0);
  const [tempGerminationRate, setTempGerminationRate] = useState<number>(0);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    variety: '',
    category: 'Vegetable Seeds' as ProductCategory,
    quantity: 50,
    unit: 'Seeds' as 'Seeds' | 'kg' | 'g' | 'unit',
    weight: 0.5,
    price: 500,
    stock: 25,
    image: '',
    description: '',
    germinationRate: 90,
  });

  const addProductCategories: ProductCategory[] =
    activeTab === 'fertilizer'
      ? FERTILIZER_CATEGORIES
      : activeTab === 'tools'
        ? ['Tools']
        : CATEGORIES.filter(
            (category) =>
              category !== 'Fertilizer' &&
              !FERTILIZER_CATEGORIES.includes(category) &&
              category !== 'Tools'
          );

  const getUnitOptions = () => {
    if (activeTab === 'tools') {
      return [{ label: 'Unit', value: 'unit' }];
    }

    if (activeTab === 'fertilizer') {
      return [
        { label: 'Kilograms (kg)', value: 'kg' },
        { label: 'Grams (g)', value: 'g' },
      ];
    }

    return [
      { label: 'Seeds', value: 'Seeds' },
      { label: 'grams', value: 'g' },
    ];
  };

  const formatPackSize = (quantity: number, unit: string) => {
    const normalizedUnit = unit.trim();
    if (normalizedUnit === 'kg' || normalizedUnit === 'g') {
      return `${quantity}${normalizedUnit}`;
    }
    if (normalizedUnit === 'unit' || normalizedUnit === 'Unit') {
      return `${quantity}`;
    }
    return `${quantity} ${normalizedUnit}`;
  };

  const resetNewProductForm = () => {
    setNewProductForm({
      name: '',
      variety: '',
      category:
        activeTab === 'fertilizer'
          ? FERTILIZER_CATEGORIES[0]
          : activeTab === 'tools'
            ? 'Tools'
            : 'Vegetable Seeds',
      quantity: activeTab === 'tools' ? 1 : 50,
      unit: activeTab === 'fertilizer' ? 'kg' : activeTab === 'tools' ? 'unit' : 'Seeds',
      weight: 0.5,
      price: 500,
      stock: 25,
      image: '',
      description: '',
      germinationRate: 90,
    });
  };

  const startEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setTempPrice(prod.price);
    setTempStock(prod.stock);
    setTempImage(prod.image);
    setTempVariety(prod.variety);
    setTempDescription(prod.description);
    setTempCategory(prod.category);
    setTempQuantity(prod.quantity);
    setTempUnit(prod.unit);
    setTempWeight(prod.weight ?? 0);
    setTempGerminationRate(prod.germinationRate);
  };

  const saveProductEdit = async (product: Product) => {
    const image = tempImage.trim();
    const variety = tempVariety.trim();
    const unit = tempUnit.trim();
    const description = tempDescription.trim();
    const isNonSeedInventory =
      product.inventoryType === 'Fertilizer' ||
      product.inventoryType === 'Tool' ||
      product.category === 'Fertilizer' ||
      product.category === 'Tools';
    const hasValidGermination =
      isNonSeedInventory ||
      (Number.isInteger(tempGerminationRate) &&
        tempGerminationRate >= 0 &&
        tempGerminationRate <= 100);

    if (
      !image ||
      !variety ||
      !unit ||
      !description ||
      Number.isNaN(tempWeight) ||
      tempWeight < 0 ||
      !Number.isInteger(tempPrice) ||
      tempPrice < 0 ||
      !Number.isInteger(tempStock) ||
      tempStock < 0 ||
      !Number.isInteger(tempQuantity) ||
      tempQuantity < 1 ||
      !hasValidGermination
    ) {
      addToast(
        'Invalid Product Details',
        isNonSeedInventory
          ? 'Enter an image URL, variety, unit, description, and valid weight. Price and stock must be non-negative whole numbers, and pack quantity must be at least 1.'
          : 'Enter an image URL, variety, unit, description, and valid weight. Price and stock must be non-negative whole numbers, pack quantity must be at least 1, and germination must be between 0 and 100.',
        'error'
      );
      return;
    }

    const updated = {
      ...product,
      image,
      imageCredit: image === product.image ? product.imageCredit : undefined,
      gallery: [
        image,
        ...product.gallery.filter(
          (galleryImage) => galleryImage !== product.image && galleryImage !== image
        ),
      ],
      category: tempCategory,
      variety,
      description,
      quantity: tempQuantity,
      unit,
      weight: tempWeight,
      price: tempPrice,
      stock: tempStock,
      germinationRate: isNonSeedInventory ? 0 : tempGerminationRate,
    };
    try {
      await seedService.updateProduct(updated, requireAdminToken());
      setProducts(await seedService.getAll());
      setEditingProductId(null);
      addToast('Updated', `${product.name} inventory details updated.`, 'success');
    } catch (error) {
      addToast(
        'Update Failed',
        error instanceof Error ? error.message : 'The product could not be updated.',
        'error'
      );
    }
  };

  const handleAddProduct = async () => {
    const name = newProductForm.name.trim();
    const variety = newProductForm.variety.trim();
    const unit = newProductForm.unit.trim();
    const image = newProductForm.image.trim();
    const description = newProductForm.description.trim();

    const inventoryType =
      activeTab === 'fertilizer' ? 'Fertilizer' : activeTab === 'tools' ? 'Tool' : 'Seed';

    const isSeedInventory = inventoryType === 'Seed';
    const hasValidGermination =
      !isSeedInventory ||
      (!Number.isInteger(newProductForm.germinationRate) ||
        newProductForm.germinationRate < 0 ||
        newProductForm.germinationRate > 100
        ? false
        : true);

    if (
      !name ||
      !variety ||
      !unit ||
      !image ||
      !description ||
      Number.isNaN(newProductForm.weight) ||
      newProductForm.weight < 0 ||
      !Number.isInteger(newProductForm.price) ||
      newProductForm.price <= 0 ||
      !Number.isInteger(newProductForm.stock) ||
      newProductForm.stock < 0 ||
      !Number.isInteger(newProductForm.quantity) ||
      newProductForm.quantity < 1 ||
      !hasValidGermination
    ) {
      addToast(
        'Incomplete Product Details',
        isSeedInventory
          ? 'Add a product name, variety, unit, image URL, description, weight, price, stock, and valid germination rate before saving.'
          : 'Add a product name, variety, unit, image URL, description, weight, price, and stock before saving.',
        'error'
      );
      return;
    }

    const product: Product = {
      id: `prod-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      name,
      variety,
      cropType:
        inventoryType === 'Seed'
          ? 'General Seed Variety'
          : inventoryType === 'Fertilizer'
            ? 'Plant Nutrition Product'
            : 'Agricultural Tool',
      category:
        inventoryType === 'Fertilizer'
          ? newProductForm.category
          : inventoryType === 'Tool'
            ? 'Tools'
            : newProductForm.category,
      price: newProductForm.price,
      currency: 'LKR',
      quantity: newProductForm.quantity,
      unit,
      weight: newProductForm.weight,
      image,
      gallery: [image],
      description,
      germinationRate: inventoryType === 'Seed' ? newProductForm.germinationRate : 0,
      growingConditions: {
        soil: 'Well-drained, fertile loam with good organic matter',
        sunlight: 'Full sun with adequate daily exposure',
        temperature: 'Warm tropical conditions suitable for cultivation',
        watering: 'Regular watering with good soil moisture management',
      },
      plantingSeason: 'Yala & Maha',
      harvestInformation: inventoryType === 'Seed' ? 'As per recommended crop cycle' : 'Usage guidance applies',
      plantSpacing: 'Follow crop-specific spacing guidance',
      sowingDepth: 'Follow package or agronomic guidance',
      stock: newProductForm.stock,
      featured: false,
      bestSeller: false,
      isNew: true,
      departmentApproved: false,
      inventoryType,
    };

    try {
      await seedService.addProduct(product, requireAdminToken());
      setProducts(await seedService.getAll());
      setShowAddProductForm(false);
      resetNewProductForm();
      addToast('Product Added', `${name} was added to the inventory.`, 'success');
    } catch (error) {
      addToast(
        'Product Add Failed',
        error instanceof Error ? error.message : 'The product could not be added.',
        'error'
      );
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = window.confirm(`Delete ${product.name} (${product.variety}) from the catalog?`);
    if (!confirmed) {
      return;
    }

    try {
      await seedService.deleteProduct(product.id, requireAdminToken());
      setProducts(await seedService.getAll());
      addToast('Product Deleted', `${product.name} removed from the catalog.`, 'info');
    } catch (error) {
      addToast(
        'Product Delete Failed',
        error instanceof Error ? error.message : 'The product could not be deleted.',
        'error'
      );
    }
  };

  const handleStatusChange = (orderId: string, status: Order['orderStatus']) => {
    orderService.updateOrderStatus(orderId, status);
    setOrders(orderService.getAll());
    addToast('Order Status Updated', `Order ${orderId} marked as ${status}.`, 'info');
  };

  const handleResetCatalog = async () => {
    try {
      setProducts(await seedService.resetToDefaults(requireAdminToken()));
      addToast('Reset to Defaults', 'Inventory restored to original Sri Lankan seed catalog.', 'info');
    } catch (error) {
      addToast(
        'Catalog Reset Failed',
        error instanceof Error ? error.message : 'The catalog could not be reset.',
        'error'
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-agro-pattern flex items-center justify-center px-4 py-12">
        <section className="w-full max-w-md rounded-3xl border border-agro-100 bg-white p-8 shadow-xl sm:p-10">
          <button
            type="button"
            onClick={navigateToHome}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-agro-800 transition hover:text-agro-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Storefront
          </button>

          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-agro-100 text-agro-800">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-charcoal-900">Admin sign in</h1>
              <p className="mt-1 text-sm text-charcoal-800/70">Enter your admin credentials to continue.</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="admin-username" className="mb-1.5 block text-sm font-semibold text-charcoal-900">
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border border-earth-300 bg-white px-4 py-3 text-charcoal-900 outline-none transition focus:border-agro-600 focus:ring-2 focus:ring-agro-600/20"
                required
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-semibold text-charcoal-900">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-earth-300 bg-white px-4 py-3 text-charcoal-900 outline-none transition focus:border-agro-600 focus:ring-2 focus:ring-agro-600/20"
                required
              />
            </div>

            {loginError && (
              <p role="alert" className="text-sm font-medium text-red-700">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-agro-800 px-4 py-3 font-bold text-white transition hover:bg-agro-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agro-800"
            >
              Sign in
            </button>
          </form>
        </section>
      </main>
    );
  }

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

          <div className="flex items-center gap-2">
            <button
              onClick={navigateToHome}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-agro-700 hover:bg-agro-600 text-white text-xs font-bold transition"
            >
              <span>Back to Storefront</span>
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setAdminToken(null);
                setUsername('');
                setPassword('');
                setLoginError('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-white text-xs font-bold transition"
              aria-label="Log out of admin"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
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
            <span>Seed Inventory ({inventoryProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fertilizer')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'fertilizer'
                ? 'border-agro-400 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Fertilizer Inventory ({fertilizerProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'tools'
                ? 'border-agro-400 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Tools ({toolProducts.length})</span>
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
        {(activeTab === 'inventory' || activeTab === 'fertilizer' || activeTab === 'tools') && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-charcoal-900 font-display">
                  {activeTab === 'inventory'
                    ? 'Live Seed Products & Stock'
                    : activeTab === 'fertilizer'
                      ? 'Fertilizer Inventory'
                      : 'Tools Inventory'}
                </h2>
                <p className="text-xs text-charcoal-800/70 mt-0.5">
                  Products and uploaded photos are shared with the storefront through the server database.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowAddProductForm(!showAddProductForm);
                    if (!showAddProductForm) {
                      resetNewProductForm();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-agro-700 text-white text-xs font-semibold hover:bg-agro-600 transition"
                  title="Add a new product to the catalog"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddProductForm ? 'Close Form' : 'Add Product'}</span>
                </button>
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

            {showAddProductForm && (
              <div className="bg-white rounded-3xl border border-agro-100 shadow-soft p-5">
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-earth-100">
                  <div>
                    <h3 className="text-lg font-bold text-charcoal-900 font-display">
                      Create New Product
                    </h3>
                    <p className="text-xs text-charcoal-700 mt-0.5">
                      Add a new {activeTab === 'fertilizer' ? 'fertilizer' : activeTab === 'tools' ? 'tool' : 'seed'} listing to the storefront inventory.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <label className="text-xs font-semibold text-charcoal-800">
                    Product Name
                    <input
                      type="text"
                      value={newProductForm.name}
                      onChange={(e) =>
                        setNewProductForm((current) => ({ ...current, name: e.target.value }))
                      }
                      className="mt-1 w-full px-3 py-2 border border-earth-200 rounded-xl bg-earth-50/40 text-charcoal-900"
                      placeholder="e.g. Tomato Seeds"
                    />
                  </label>

                  <label className="text-xs font-semibold text-charcoal-800">
                    Variety
                    <input
                      type="text"
                      value={newProductForm.variety}
                      onChange={(e) =>
                        setNewProductForm((current) => ({ ...current, variety: e.target.value }))
                      }
                      className="mt-1 w-full px-3 py-2 border border-earth-200 rounded-xl bg-earth-50/40 text-charcoal-900"
                      placeholder="e.g. T-245 (Target F1)"
                    />
                  </label>

                  <label className="text-xs font-semibold text-charcoal-800">
                    Category
                    <select
                      value={newProductForm.category}
                      onChange={(e) =>
                        setNewProductForm((current) => ({
                          ...current,
                          category: e.target.value as ProductCategory,
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 border border-earth-200 rounded-xl bg-earth-50/40 text-charcoal-900"
                    >
                      {addProductCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-xs font-semibold text-charcoal-800">
                    Price (LKR)
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={newProductForm.price}
                      onChange={(e) =>
                        setNewProductForm((current) => ({
                          ...current,
                          price: Number(e.target.value),
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 border border-earth-200 rounded-xl bg-earth-50/40 text-charcoal-900"
                    />
                  </label>

                  <label className="text-xs font-semibold text-charcoal-800">
                    Stock (Packets)
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={newProductForm.stock}
                      onChange={(e) =>
                        setNewProductForm((current) => ({
                          ...current,
                          stock: Number(e.target.value),
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 border border-earth-200 rounded-xl bg-earth-50/40 text-charcoal-900"
                    />
                  </label>

                  <label className="text-xs font-semibold text-charcoal-800">
                    Weight (kg)
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={newProductForm.weight}
                      onChange={(e) =>
                        setNewProductForm((current) => ({
                          ...current,
                          weight: Number(e.target.value),
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 border border-earth-200 rounded-xl bg-earth-50/40 text-charcoal-900"
                    />
                  </label>

                  {activeTab !== 'tools' && (
                    <>
                      <label className="text-xs font-semibold text-charcoal-800">
                        {activeTab === 'fertilizer' ? 'Pack Size' : 'Pack Quantity'}
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={newProductForm.quantity}
                          onChange={(e) =>
                            setNewProductForm((current) => ({
                              ...current,
                              quantity: Number(e.target.value),
                            }))
                          }
                          className="mt-1 w-full px-3 py-2 border border-earth-200 rounded-xl bg-earth-50/40 text-charcoal-900"
                        />
                        {activeTab === 'fertilizer' && (
                          <span className="mt-1 block text-[11px] font-normal text-charcoal-700/70">
                            Enter the pack amount, such as 1, 200, or 25, then choose kg or g.
                          </span>
                        )}
                      </label>

                      <label className="text-xs font-semibold text-charcoal-800">
                        Unit
                        <select
                          value={newProductForm.unit}
                          onChange={(e) =>
                            setNewProductForm((current) => ({
                              ...current,
                              unit: e.target.value as 'Seeds' | 'kg' | 'g' | 'unit',
                            }))
                          }
                          className="mt-1 w-full px-3 py-2 border border-earth-200 rounded-xl bg-earth-50/40 text-charcoal-900"
                        >
                          {getUnitOptions().map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </>
                  )}

                  {activeTab === 'inventory' && (
                    <label className="text-xs font-semibold text-charcoal-800">
                      Germination Rate (%)
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={newProductForm.germinationRate}
                        onChange={(e) =>
                          setNewProductForm((current) => ({
                            ...current,
                            germinationRate: Number(e.target.value),
                          }))
                        }
                        className="mt-1 w-full px-3 py-2 border border-earth-200 rounded-xl bg-earth-50/40 text-charcoal-900"
                      />
                    </label>
                  )}

                  <label className="md:col-span-2 xl:col-span-3 text-xs font-semibold text-charcoal-800">
                    Product Image URL
                    <input
                      type="url"
                      value={newProductForm.image}
                      onChange={(e) =>
                        setNewProductForm((current) => ({ ...current, image: e.target.value }))
                      }
                      className="mt-1 w-full px-3 py-2 border border-earth-200 rounded-xl bg-earth-50/40 text-charcoal-900"
                      placeholder="https://example.com/image.jpg"
                    />
                    <span className="mt-2 block">Or upload an image (JPG, PNG, WebP or GIF; max 5 MB)</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      aria-label="Upload product photo"
                      onChange={async (event) => {
                        const input = event.currentTarget;
                        const file = input.files?.[0];
                        if (!file) return;
                        const uploadedUrl = await uploadProductPhoto(file);
                        if (uploadedUrl) {
                          setNewProductForm((current) => ({ ...current, image: uploadedUrl }));
                        }
                        input.value = '';
                      }}
                      className="mt-1 block w-full text-xs text-charcoal-800"
                    />
                  </label>

                  <label className="md:col-span-2 xl:col-span-3 text-xs font-semibold text-charcoal-800">
                    Description
                    <textarea
                      value={newProductForm.description}
                      onChange={(e) =>
                        setNewProductForm((current) => ({
                          ...current,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                      className="mt-1 w-full px-3 py-2 border border-earth-200 rounded-xl bg-earth-50/40 text-charcoal-900"
                      placeholder="Briefly describe the seed variety, performance, and growing value."
                    />
                  </label>
                </div>

                <div className="mt-5 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowAddProductForm(false);
                      resetNewProductForm();
                    }}
                    className="px-3 py-2 rounded-xl bg-gray-200 text-charcoal-800 text-xs font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddProduct}
                    className="px-3 py-2 rounded-xl bg-agro-700 text-white text-xs font-semibold hover:bg-agro-600 transition"
                  >
                    Save Product
                  </button>
                </div>
              </div>
            )}

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
                      {activeTab === 'inventory' && <th className="py-3.5 px-4">Germination</th>}
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-earth-100">
                    {(activeTab === 'inventory'
                      ? inventoryProducts
                      : activeTab === 'fertilizer'
                        ? fertilizerProducts
                        : toolProducts
                    ).map((prod) => {
                      const isEditing = editingProductId === prod.id;
                      return (
                        <tr key={prod.id} className="hover:bg-agro-50/30 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={isEditing ? tempImage : prod.image}
                                alt={prod.name}
                                className="w-10 h-10 rounded-xl object-cover bg-earth-100 flex-shrink-0"
                              />
                              <div>
                                <span className="font-bold text-charcoal-900 block">{prod.name}</span>
                                <span className="text-[11px] text-agro-700 font-semibold">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={tempVariety}
                                      onChange={(e) => setTempVariety(e.target.value)}
                                      aria-label={`${prod.name} variety`}
                                      className="w-48 px-2 py-1 border rounded bg-white"
                                    />
                                  ) : (
                                    prod.variety
                                  )}
                                </span>
                                {isEditing && (
                                  <>
                                    <input
                                      type="url"
                                      value={tempImage}
                                      onChange={(e) => setTempImage(e.target.value)}
                                      aria-label={`${prod.name} photo URL`}
                                      placeholder="Photo URL"
                                      className="mt-1 w-48 px-2 py-1 border rounded bg-white"
                                    />
                                    <input
                                      type="file"
                                      accept="image/jpeg,image/png,image/webp,image/gif"
                                      aria-label={`Upload ${prod.name} photo`}
                                      onChange={async (event) => {
                                        const input = event.currentTarget;
                                        const file = input.files?.[0];
                                        if (!file) return;
                                        const uploadedUrl = await uploadProductPhoto(file);
                                        if (uploadedUrl) setTempImage(uploadedUrl);
                                        input.value = '';
                                      }}
                                      className="mt-1 block w-48 text-[10px]"
                                    />
                                    <textarea
                                      value={tempDescription}
                                      onChange={(e) => setTempDescription(e.target.value)}
                                      aria-label={`${prod.name} description`}
                                      placeholder="Description"
                                      rows={2}
                                      className="mt-1 w-48 px-2 py-1 border rounded bg-white"
                                    />
                                  </>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            {isEditing ? (
                              <select
                                value={tempCategory}
                                onChange={(e) => setTempCategory(e.target.value as ProductCategory)}
                                className="w-32 px-2 py-1 border rounded bg-white"
                              >
                                {CATEGORIES.map((category) => (
                                  <option key={category} value={category}>
                                    {category}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-earth-100 text-charcoal-800 text-[10px] font-semibold">
                                {prod.category}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 font-medium">
                            {isEditing ? (
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={tempQuantity}
                                    onChange={(e) => setTempQuantity(Number(e.target.value))}
                                    aria-label={`${prod.name} pack quantity`}
                                    className="w-16 px-2 py-1 border rounded bg-white"
                                  />
                                  <input
                                    type="text"
                                    value={tempUnit}
                                    onChange={(e) => setTempUnit(e.target.value)}
                                    aria-label={`${prod.name} pack unit`}
                                    className="w-16 px-2 py-1 border rounded bg-white"
                                  />
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-gray-500">Weight</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={tempWeight}
                                    onChange={(e) => setTempWeight(Number(e.target.value))}
                                    aria-label={`${prod.name} weight`}
                                    className="w-16 px-2 py-1 border rounded bg-white"
                                  />
                                </div>
                              </div>
                            ) : (
                              formatPackSize(prod.quantity, prod.unit)
                            )}
                          </td>

                          <td className="py-3 px-4 font-bold">
                            {isEditing ? (
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(Number(e.target.value))}
                                aria-label={`${prod.name} price`}
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
                                min="0"
                                step="1"
                                value={tempStock}
                                onChange={(e) => setTempStock(Number(e.target.value))}
                                aria-label={`${prod.name} stock`}
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

                          {activeTab === 'inventory' && (
                            <td className="py-3 px-4 font-medium text-emerald-700">
                              {isEditing ? (
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="1"
                                  value={tempGerminationRate}
                                  onChange={(e) => setTempGerminationRate(Number(e.target.value))}
                                  aria-label={`${prod.name} germination rate`}
                                  className="w-20 px-2 py-1 border rounded bg-white text-charcoal-900"
                                />
                              ) : (
                                `${prod.germinationRate}% Viable`
                              )}
                            </td>
                          )}

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
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => startEditProduct(prod)}
                                  className="inline-flex items-center gap-1 text-agro-700 hover:text-agro-900 font-semibold p-1"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod)}
                                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold p-1"
                                  title={`Delete ${prod.name}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
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
