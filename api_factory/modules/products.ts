import { GATEWAY_ENDPOINT } from "../axios.config"

// Enum Definitions
export enum ProductCategory {
  BOOKS = 'books',
  EBOOKS = 'ebooks',
  COURSES = 'courses',
  CLOTHING = 'clothing',
  ACCESSORIES = 'accessories',
  SOFTWARE = 'software',
  TEMPLATES = 'templates',
  TOOLS = 'tools'
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  ARCHIVED = 'archived'
}

export enum ProductAvailability {
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
  LIMITED_STOCK = 'limited_stock',
  BACKORDER = 'backorder',
  DISCONTINUED = 'discontinued'
}

// Type Definitions
export type ProductDimensions = {
  length: number
  width: number
  height: number
}

export type Product = {
  id?: string
  name: string
  description: string
  category: ProductCategory
  author: string
  imageUrl: string
  price: number
  originalPrice?: number
  status?: ProductStatus
  availability?: ProductAvailability
  stock?: number
  isbn?: string
  publisher?: string
  publicationDate?: Date
  pages?: number
  duration?: number
  instructor?: string
  sizes?: string[]
  colors?: string[]
  materials?: string[]
  tags?: string[]
  features?: string[]
  imageGallery?: string[]
  videoUrl?: string
  weight?: number
  dimensions?: ProductDimensions
  isDigital?: boolean
  downloadUrl?: string
  previewUrl?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateProductData = {
  name: string
  description: string
  category: ProductCategory
  author: string
  imageUrl: string
  price: number
  originalPrice?: number
  status?: ProductStatus
  availability?: ProductAvailability
  stock?: number
  isbn?: string
  publisher?: string
  publicationDate?: Date
  pages?: number
  duration?: number
  instructor?: string
  sizes?: string[]
  colors?: string[]
  materials?: string[]
  tags?: string[]
  features?: string[]
  imageGallery?: string[]
  videoUrl?: string
  weight?: number
  dimensions?: ProductDimensions
  isDigital?: boolean
  downloadUrl?: string
  previewUrl?: string
}

export type UpdateProductData = Partial<CreateProductData>

export type QueryProductParams = {
  page?: number
  limit?: number
  category?: ProductCategory
  status?: ProductStatus
  availability?: ProductAvailability
  tags?: string[]
  priceMin?: number
  priceMax?: number
  search?: string
  author?: string
  publisher?: string
  instructor?: string
  isDigital?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type ProductStats = {
  totalProducts: number
  totalCategories: number
  totalAuthors: number
  totalValue: number
  averagePrice: number
  lowStockProducts: number
  outOfStockProducts: number
  digitalProducts: number
  physicalProducts: number
  recentProducts: number
}

export type CategoryData = {
  category: ProductCategory
  count: number
  averagePrice: number
  totalValue: number
}

export type PopularTag = {
  tag: string
  count: number
}

export type FilterOptions = {
  categories: CategoryData[]
  priceRange: {
    min: number
    max: number
  }
  authors: string[]
  publishers: string[]
  instructors: string[]
  tags: string[]
  sizes: string[]
  colors: string[]
  materials: string[]
}

export type StockUpdateData = {
  quantity: number
}

// API Factory
export const products_api = {
  // Create single product
  $_create_product: async (productData: CreateProductData) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.post(url, productData)
  },

  // Create multiple products in batch
  $_batch_create_products: async (productsData: CreateProductData[]) => {
    const url = `/products/batch`
    return GATEWAY_ENDPOINT.post(url, productsData)
  },

  // Get all products with filtering and pagination
  $_get_products: async (queryParams?: QueryProductParams) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.get(url, { params: queryParams })
  },

  // Get featured products
  $_get_featured_products: async () => {
    const url = `/products/featured`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Get best selling products
  $_get_best_sellers: async () => {
    const url = `/products/best-sellers`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Get new arrival products
  $_get_new_arrivals: async () => {
    const url = `/products/new-arrivals`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Get products on sale
  $_get_products_on_sale: async () => {
    const url = `/products/on-sale`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Get product categories with counts
  $_get_categories: async () => {
    const url = `/products/categories`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Get product statistics
  $_get_stats: async () => {
    const url = `/products/stats`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Get popular product tags
  $_get_popular_tags: async () => {
    const url = `/products/tags`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Get filter options for products
  $_get_filters: async () => {
    const url = `/products/filters`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Get products by category
  $_get_products_by_category: async (category: ProductCategory) => {
    const url = `/products/category/${category}`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Get product by ID
  $_get_product: async (productId: string) => {
    const url = `/products/${productId}`
    return GATEWAY_ENDPOINT.get(url)
  },

  // Update product
  $_update_product: async (productId: string, updateData: UpdateProductData) => {
    const url = `/products/${productId}`
    return GATEWAY_ENDPOINT.patch(url, updateData)
  },

  // Update product stock
  $_update_product_stock: async (productId: string, quantity: number) => {
    const url = `/products/${productId}/stock`
    return GATEWAY_ENDPOINT.patch(url, { quantity })
  },

  // Delete product
  $_delete_product: async (productId: string) => {
    const url = `/products/${productId}`
    return GATEWAY_ENDPOINT.delete(url)
  },

  // Utility methods for common operations
  $_search_products: async (searchTerm: string, limit: number = 20) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        search: searchTerm, 
        limit 
      } 
    })
  },

  $_get_products_by_author: async (author: string, limit?: number) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        author, 
        limit 
      } 
    })
  },

  $_get_products_by_publisher: async (publisher: string, limit?: number) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        publisher, 
        limit 
      } 
    })
  },

  $_get_products_by_instructor: async (instructor: string, limit?: number) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        instructor, 
        limit 
      } 
    })
  },

  $_get_products_by_price_range: async (priceMin: number, priceMax: number, limit?: number) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        priceMin, 
        priceMax, 
        limit 
      } 
    })
  },

  $_get_products_by_tags: async (tags: string[], limit?: number) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        tags, 
        limit 
      } 
    })
  },

  $_get_digital_products: async (limit?: number) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        isDigital: true, 
        limit 
      } 
    })
  },

  $_get_physical_products: async (limit?: number) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        isDigital: false, 
        limit 
      } 
    })
  },

  $_get_in_stock_products: async (limit?: number) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        availability: 'available', 
        limit 
      } 
    })
  },

  $_get_out_of_stock_products: async (limit?: number) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        availability: ProductAvailability.OUT_OF_STOCK, 
        limit 
      } 
    })
  },

  $_get_products_by_status: async (status: ProductStatus, limit?: number) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        status, 
        limit 
      } 
    })
  },

  $_get_discounted_products: async (limit?: number) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        // This would need backend support to filter products where originalPrice > price
        sortBy: 'discount', 
        sortOrder: 'desc',
        limit 
      } 
    })
  },

  $_get_latest_products: async (limit: number = 10) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        limit, 
        sortBy: 'createdAt', 
        sortOrder: 'desc' 
      } 
    })
  },

  $_get_products_by_multiple_categories: async (categories: ProductCategory[], limit?: number) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        category: categories, // Assuming backend supports array
        limit 
      } 
    })
  },

  $_get_books_by_publication_year: async (year: number, limit?: number) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        category: ProductCategory.BOOKS,
        // This would need backend support for year filtering
        publicationYear: year,
        limit 
      } 
    })
  },

  $_get_courses_by_duration: async (minDuration: number, maxDuration: number, limit?: number) => {
    const url = `/products`
    return GATEWAY_ENDPOINT.get(url, { 
      params: { 
        category: ProductCategory.COURSES,
        // This would need backend support for duration range filtering
        minDuration,
        maxDuration,
        limit 
      } 
    })
  }
}