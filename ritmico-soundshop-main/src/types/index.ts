export interface Product {
  id: string;
  categoria: string;
  nombre: string;
  marca: string;
  precio: number;
  rating: number;
  stock: number;
  imagenes: string[];
  descripcion: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  email: string;
  name: string;
}

export interface Order {
  id: string;
  fecha: string;
  productos: CartItem[];
  subtotal: number;
  iva: number;
  envio: number;
  total: number;
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado';
}

export interface CheckoutAddress {
  nombre: string;
  telefono: string;
  calle: string;
  ciudad: string;
  codigoPostal: string;
}
