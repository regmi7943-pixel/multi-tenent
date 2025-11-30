import { API_BASE_URL } from '../constants/config';

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

class ApiService {
    private baseUrl: string;
    private token: string | null = null;
    private user: User | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    setToken(token: string | null) {
        this.token = token;
    }

    getToken() {
        return this.token;
    }

    setUser(user: User | null) {
        this.user = user;
    }

    getUser(): User | null {
        return this.user;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config: RequestInit = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);

            if (response.status === 204) {
                return null as any;
            }

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                // console.error('API Error Response:', {
                //     status: response.status,
                //     data: data
                // });
                const errorMessage = typeof data === 'object' && data.message
                    ? data.message
                    : (typeof data === 'string' ? data : `Request failed with status ${response.status}`);
                throw new Error(errorMessage);
            }

            return data;
        } catch (error: any) {
            // console.error('API Request Error:', error);
            throw error;
        }
    }

    async login(email: string, password: string) {
        return this.request<any>('api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async register(name: string, email: string, password: string) {
        return this.request<any>('api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
    }

    async getProducts() {
        return this.request<Product[]>('api/products', {
            method: 'GET',
        });
    }

    async createProduct(data: CreateProductData) {
        return this.request<Product>('api/products', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateProduct(id: string, data: Partial<CreateProductData>) {
        console.log('Updating product with ID:', id);
        try {
            const result = await this.request<Product>(`api/products/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            console.log('Update successful');
            return result;
        } catch (error) {
            console.error('Update failed:', error);
            throw error;
        }
    }

    async deleteProduct(id: string) {
        console.log('Deleting product with ID:', id);
        try {
            const result = await this.request<void>(`api/products/${id}`, {
                method: 'DELETE',
            });
            console.log('Delete successful');
            return result;
        } catch (error) {
            console.error('Delete failed:', error);
            throw error;
        }
    }

    async getOrders() {
        return this.request<any[]>('api/orders/pos', {
            method: 'GET',
        });
    }
}

export interface Product {
    _id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    requiresStock: boolean;
    lowStockThreshold: number;
    images: string[];
}

export interface CreateProductData {
    name: string;
    price: number;
    stock: number;
    category: string;
    requiresStock: boolean;
    lowStockThreshold: number;
    images: string[];
}

export const api = new ApiService(API_BASE_URL);
