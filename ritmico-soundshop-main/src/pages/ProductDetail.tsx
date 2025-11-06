import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Star, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import productsData from '@/data/products.json';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const foundProduct = productsData.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct as Product);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Producto no encontrado</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${quantity} ${product.nombre} agregado${quantity > 1 ? 's' : ''} al carrito`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-3 py-4">
        <Button
          variant="ghost"
          className="mb-4 h-10"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="space-y-6">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.imagenes[selectedImage]}
                alt={product.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/800x800/cccccc/666666?text=' + encodeURIComponent(product.nombre);
                }}
              />
            </div>
            {product.imagenes.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.imagenes.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors min-h-[44px] ${
                      selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.nombre} ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/200x200/cccccc/666666?text=' + encodeURIComponent(product.nombre);
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {product.marca}
              </p>
              <h1 className="text-xl font-bold mb-3 leading-tight">{product.nombre}</h1>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-semibold text-sm">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <Badge variant="secondary" className="text-xs">{product.categoria}</Badge>
              </div>

              <div className="text-2xl font-bold text-primary mb-4">
                {formatCurrency(product.precio)}
              </div>

              {product.stock < 5 && product.stock > 0 && (
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning mb-4">
                  ¡Solo quedan {product.stock} en stock!
                </Badge>
              )}

              {product.stock === 0 && (
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive mb-4">
                  Agotado
                </Badge>
              )}
            </div>

            <div>
              <h2 className="font-semibold text-sm mb-2">Descripción</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{product.descripcion}</p>
            </div>

            <div>
              <h2 className="font-semibold text-sm mb-2">Características</h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Cantidad:</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-bold text-base w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full gradient-primary text-base h-12"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Agregar al Carrito
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
