'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ShopifyStore {
  id: string;
  shop_domain: string;
  is_active: boolean;
  created_at: string;
  settings: {
    auto_sync: boolean;
    sync_interval_minutes: number;
    send_order_confirmations: boolean;
    send_shipping_updates: boolean;
    send_delivery_updates: boolean;
  };
}

export default function IntegrationsPage() {
  const { user, company } = useAuth();
  const [shopDomain, setShopDomain] = useState('');
  const [connectedStores, setConnectedStores] = useState<ShopifyStore[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

  // Fetch connected stores
  useEffect(() => {
    if (company?.id) {
      fetchStores();
    }
  }, [company]);

  const fetchStores = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SHOPIFY_API_URL}/api/stores?company_id=${company.id}`
      );
      const data = await response.json();
      setConnectedStores(data.stores || []);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    }
  };

  const handleConnect = async () => {
    if (!shopDomain.trim()) {
      alert('Please enter your Shopify store domain');
      return;
    }

    // Validate domain format
    const domain = shopDomain.trim().toLowerCase();
    if (!domain.includes('.myshopify.com')) {
      alert('Please enter a valid Shopify domain (e.g., yourstore.myshopify.com)');
      return;
    }

    setLoading(true);

    // Redirect to Shopify OAuth
    window.location.href = `${process.env.NEXT_PUBLIC_SHOPIFY_API_URL}/auth/shopify?shop=${domain}&company_id=${company.id}`;
  };

  const handleDisconnect = async (storeId: string) => {
    if (!confirm('Are you sure you want to disconnect this store? All synced data will remain, but new orders will not be synced.')) {
      return;
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_SHOPIFY_API_URL}/auth/disconnect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_id: storeId }),
      });

      fetchStores();
    } catch (error) {
      console.error('Failed to disconnect store:', error);
      alert('Failed to disconnect store. Please try again.');
    }
  };

  const handleManualSync = async (storeId: string) => {
    setSyncing(storeId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SHOPIFY_API_URL}/api/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_id: storeId }),
      });

      const data = await response.json();
      alert(`Sync completed! ${data.orders_synced} orders synced.`);
    } catch (error) {
      console.error('Failed to sync store:', error);
      alert('Failed to sync orders. Please try again.');
    } finally {
      setSyncing(null);
    }
  };

  const handleUpdateSettings = async (storeId: string, settings: any) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SHOPIFY_API_URL}/api/stores/${storeId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      fetchStores();
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings. Please try again.');
    }
  };

  // Check if we just connected a store (from OAuth callback)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('shopify_connected') === 'true') {
      alert('Shopify store connected successfully!');
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
      fetchStores();
    } else if (params.get('shopify_error')) {
      alert(`Failed to connect store: ${params.get('shopify_error')}`);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-display text-gray-900 mb-2">Integrations</h1>
      <p className="text-body text-gray-600 mb-6">
        Connect external services to sync data and send notifications through Beeylo.
      </p>

      {/* Shopify Connection */}
      <div className="card p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.337 2.367c-.091 0-.182.091-.273.091-.091 0-1.64.91-1.64.91s-1.094.91-1.094 1.092c0 0-.273 0-.547.091-1.458.455-2.734 1.092-4.01 2.002-.182.091-.364.182-.546.364-.182.091-.455.273-.637.455-.91.637-1.82 1.365-2.73 2.093-.273.182-.546.455-.819.728-.273.273-.546.546-.728.819-.546.637-1.001 1.274-1.366 2.002-.091.182-.182.364-.273.546-.182.455-.273.91-.364 1.365 0 .182-.091.364-.091.546 0 .091 0 .182-.091.364 0 .091 0 .182 0 .273 0 .091 0 .273.091.364 0 .182.091.364.091.546.091.182.091.455.182.637.091.182.182.455.364.728.091.182.273.455.455.637.182.273.455.546.728.819.273.273.546.455.91.637.273.182.637.364 1.001.455.273.091.637.182 1.001.182h.182c.182 0 .364 0 .546-.091.364-.091.728-.273 1.092-.455.182-.091.364-.182.546-.364.364-.182.728-.455 1.092-.728.182-.091.364-.273.546-.455.91-.728 1.821-1.547 2.64-2.457.182-.182.364-.455.546-.637.546-.728 1.001-1.456 1.366-2.275.091-.182.182-.364.273-.546.273-.728.455-1.365.546-2.093 0-.182.091-.364.091-.546 0-.182 0-.364.091-.546v-.364c0-.091 0-.182 0-.273 0-.091 0-.182 0-.364 0-.182-.091-.364-.091-.546-.091-.364-.182-.728-.364-1.092-.091-.182-.182-.455-.364-.728-.182-.273-.364-.546-.637-.819-.273-.273-.546-.546-.91-.819-.273-.182-.637-.455-1.001-.637-.273-.091-.637-.273-1.001-.364-.364-.091-.728-.182-1.092-.182h-.273c-.091 0-.182 0-.273.091z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-heading font-semibold text-gray-900">Shopify Integration</h2>
            <p className="text-body-small text-gray-600">
              Sync orders and send notifications directly to customers
            </p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-body-small text-blue-800">
            <strong>💡 What this does:</strong> When customers place orders on your Shopify store,
            Beeylo will automatically send order confirmations, shipping updates, and delivery
            notifications directly to their app - replacing email notifications.
          </p>
        </div>

        {connectedStores.length === 0 ? (
          <div>
            <label className="block text-body font-medium text-gray-700 mb-2">
              Shopify Store Domain
            </label>
            <input
              type="text"
              value={shopDomain}
              onChange={(e) => setShopDomain(e.target.value)}
              placeholder="yourstore.myshopify.com"
              className="input mb-3"
              disabled={loading}
            />
            <button
              onClick={handleConnect}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Connecting...' : 'Connect Shopify Store'}
            </button>
            <p className="text-body-small text-gray-500 mt-2">
              You'll be redirected to Shopify to approve the connection
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {connectedStores.map((store) => (
              <div key={store.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Store Header */}
                <div className="flex items-center justify-between p-4 bg-gray-50">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${store.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div>
                      <div className="font-medium text-gray-900">{store.shop_domain}</div>
                      <div className="text-body-small text-gray-600">
                        Connected {new Date(store.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleManualSync(store.id)}
                      disabled={syncing === store.id}
                      className="btn-secondary text-caption"
                    >
                      {syncing === store.id ? 'Syncing...' : 'Sync Now'}
                    </button>
                    <button
                      onClick={() => handleDisconnect(store.id)}
                      className="btn-secondary text-red-600 text-caption"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>

                {/* Store Settings */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-body font-medium text-gray-900">Order Confirmations</div>
                      <div className="text-body-small text-gray-600">
                        Send notification when order is created
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={store.settings.send_order_confirmations}
                        onChange={(e) => handleUpdateSettings(store.id, {
                          ...store.settings,
                          send_order_confirmations: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-body font-medium text-gray-900">Shipping Updates</div>
                      <div className="text-body-small text-gray-600">
                        Send notification when order is shipped
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={store.settings.send_shipping_updates}
                        onChange={(e) => handleUpdateSettings(store.id, {
                          ...store.settings,
                          send_shipping_updates: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-body font-medium text-gray-900">Delivery Updates</div>
                      <div className="text-body-small text-gray-600">
                        Send notification when order is delivered
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={store.settings.send_delivery_updates}
                        onChange={(e) => handleUpdateSettings(store.id, {
                          ...store.settings,
                          send_delivery_updates: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                setConnectedStores([]);
                setShopDomain('');
              }}
              className="btn-secondary w-full"
            >
              Connect Another Store
            </button>
          </div>
        )}
      </div>

      {/* Future Integrations Placeholder */}
      <div className="card p-6 opacity-50">
        <h3 className="text-body font-semibold text-gray-700 mb-2">More Integrations Coming Soon</h3>
        <p className="text-body-small text-gray-600">
          WooCommerce, Magento, and other e-commerce platforms
        </p>
      </div>
    </div>
  );
}
