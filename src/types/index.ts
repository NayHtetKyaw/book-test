export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  description?: string;
  isbn?: string;
  category?: string;
  imageUrl?: string;
  rating?: number;
  stock?: number;
}

export interface CartItem extends Book {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export interface CartState {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}
