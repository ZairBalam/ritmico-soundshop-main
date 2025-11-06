import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.nombre} agregado al carrito`);
  };

  return (
    <Card 
      className="group cursor-pointer active:scale-[0.98] transition-all duration-200 overflow-hidden flex flex-col"
      onClick={() => navigate(`/producto/${product.id}`)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.imagenes[0]}
          alt={product.nombre}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/800x800/cccccc/666666?text=' + encodeURIComponent(product.nombre);
          }}
        />
        {product.stock < 5 && product.stock > 0 && (
          <Badge className="absolute top-1 right-1 bg-warning text-warning-foreground text-[10px] px-1.5 py-0.5">
            ¡Últimas {product.stock}!
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge className="absolute top-1 right-1 bg-destructive text-[10px] px-1.5 py-0.5">
            Agotado
          </Badge>
        )}
      </div>
      
      <CardContent className="p-3 flex-1 flex flex-col">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
          {product.marca}
        </p>
        <h3 className="font-semibold text-xs mb-1.5 line-clamp-2 min-h-[2rem] leading-tight">
          {product.nombre}
        </h3>
        
        <div className="flex items-center gap-1 mb-1.5">
          <Star className="h-3 w-3 fill-accent text-accent" />
          <span className="text-[10px] font-medium">{product.rating}</span>
        </div>

        <div className="flex items-center justify-between mb-2 mt-auto">
          <span className="text-primary font-bold text-sm">
            {formatCurrency(product.precio)}
          </span>
        </div>

        <Button
          className="w-full h-9 text-xs"
          size="sm"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
          Agregar
        </Button>
      </CardContent>
    </Card>
  );
};
