// API utility functions for market shipments with row-level locking
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(
      errorData.detail || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }
  return response.json();
};

// Market Shipment API functions
export const marketShipmentApi = {
  // Get all market shipments for current user's centra (session-based)
  getMarketShipmentsForUser: async (skip = 0, limit = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/market_shipments/user?skip=${skip}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include session cookies
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error occurred', 0, error);
    }
  },

  // Get all market shipments for a specific centra (manual centra ID - deprecated)
  getMarketShipmentsByCentra: async (centraId, skip = 0, limit = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/market_shipments/centra/${centraId}?skip=${skip}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error occurred', 0, error);
    }
  },

  // Get specific market shipment by ID
  getMarketShipmentById: async (marketShipmentId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/market_shipment/get/${marketShipmentId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error occurred', 0, error);
    }
  },

  // Update market shipment status
  updateMarketShipmentStatus: async (marketShipmentId, status) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/market_shipment/${marketShipmentId}/status?status=${encodeURIComponent(status)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error occurred', 0, error);
    }
  },
};

// Transaction API functions with row-level locking
export const transactionApi = {
  // Complete a transaction and process products
  completeTransaction: async (transactionId, userId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/transaction/${transactionId}/complete?user_id=${encodeURIComponent(userId)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error occurred', 0, error);
    }
  },

  // Cancel a transaction and release products
  cancelTransaction: async (transactionId, userId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/transaction/${transactionId}/cancel?user_id=${encodeURIComponent(userId)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error occurred', 0, error);
    }
  },

  // Check product lock status
  getProductLockStatus: async (productTypeId, productId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/product/${productTypeId}/${productId}/lock-status`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 404) {
          // Product not found or no lock
          return null;
        }
        throw error;
      }
      throw new ApiError('Network error occurred', 0, error);
    }
  },

  // Update product status with locking
  updateProductStatus: async (productTypeId, productId, newStatus) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/product/${productTypeId}/${productId}/status?new_status=${encodeURIComponent(newStatus)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error occurred', 0, error);
    }
  },
};

// Product Availability Utility Functions
export const productAvailabilityUtils = {
  // Check if a product is available for purchase
  isProductAvailable: (product) => {
    if (!product) return false;
    
    const status = product.status?.toLowerCase();
    const isExpired = product.expiry_time <= 0;
    
    // Product is unavailable if:
    // 1. Status is "Reserved", "Processed", "Cancelled", "Thrown", or any unavailable status
    // 2. Product is expired
    return !isExpired && 
           status !== 'reserved' && 
           status !== 'processed' && 
           status !== 'cancelled' && 
           status !== 'thrown' &&
           (status === 'awaiting' || status === 'available');
  },

  // Get availability message for display
  getAvailabilityMessage: (product) => {
    if (!product) return '';
    
    const status = product.status?.toLowerCase();
    const isExpired = product.expiry_time <= 0;
    
    if (isExpired) {
      return 'This product has expired and is no longer available for purchase.';
    }
    
    switch (status) {
      case 'reserved':
        return 'This product is currently reserved by another customer.';
      case 'processed':
        return 'This product has been processed and is no longer available.';
      case 'cancelled':
        return 'This product has been cancelled and is no longer available for purchase.';
      case 'thrown':
        return 'This product is no longer available.';
      default:
        return 'This product is currently unavailable for purchase.';
    }
  },

  // Get status badge info for display
  getStatusBadgeInfo: (product) => {
    if (!product) return { label: 'Unknown', className: 'bg-gray-100 text-gray-800' };
    
    const isAvailable = productAvailabilityUtils.isProductAvailable(product);
    const isExpired = product.expiry_time <= 0;
    
    if (isExpired) {
      return { label: 'Expired', className: 'bg-red-100 text-red-800' };
    }
    
    if (isAvailable) {
      return { label: 'Available', className: 'bg-green-100 text-green-800' };
    }
    
    const status = product.status?.charAt(0).toUpperCase() + product.status?.slice(1).toLowerCase() || 'Unavailable';
    return { label: status, className: 'bg-yellow-100 text-yellow-800' };
  }
};

// Marketplace API functions
export const marketplaceApi = {
  // Get all marketplace items (homepage)
  getMarketplaceItems: async (skip = 0, limit = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/marketplace/get?skip=${skip}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error occurred', 0, error);
    }
  },

  // Get marketplace items for a specific centra
  getMarketplaceItemsByCentra: async (centraName, skip = 0, limit = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/marketplace/get_by_centra/${encodeURIComponent(centraName)}?skip=${skip}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error occurred', 0, error);
    }
  },

  // Get product details
  getProductDetails: async (productId, productName, username) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/marketplace/get_product_details?product_id=${productId}&product_name=${encodeURIComponent(productName)}&username=${encodeURIComponent(username)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error occurred', 0, error);
    }
  },

  // Search marketplace products
  searchProducts: async (query, skip = 0, limit = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/marketplace/search_products?query=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error occurred', 0, error);
    }
  }
};

export { ApiError };