import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/formatters';
import { useNavigate } from 'react-router-dom';

export const CartDrawer = () => {
  const { items, itemCount, totals, incrementItem, decrementItem, removeItem } = useCart();
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center badge-pulse">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full flex flex-col max-w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingCart className="h-16 w-16 mb-4 opacity-20" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-4 bg-card rounded-lg border">
                  <img
                    src={item.product.imagenes[0]}
                    alt={item.product.nombre}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/200x200/cccccc/666666?text=' + encodeURIComponent(item.product.nombre);
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.product.nombre}</h4>
                    <p className="text-xs text-muted-foreground">{item.product.marca}</p>
                    <p className="text-primary font-bold mt-1">{formatCurrency(item.product.precio)}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => decrementItem(item.product.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-bold text-primary w-8 text-center">
                        x{item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => incrementItem(item.product.id)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-auto text-destructive"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (16%):</span>
                <span>{formatCurrency(totals.iva)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span className={totals.envio === 0 ? "text-success font-semibold" : ""}>
                  {totals.envio === 0 ? "¡GRATIS!" : formatCurrency(totals.envio)}
                </span>
              </div>
              {totals.subtotal < 3000 && (
                <p className="text-xs text-muted-foreground">
                  Agrega {formatCurrency(3000 - totals.subtotal)} más para envío gratis
                </p>
              )}
            </div>
            
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span className="text-primary">{formatCurrency(totals.total)}</span>
            </div>

            <Button
              className="w-full gradient-primary h-12 text-base"
              size="lg"
              onClick={() => navigate('/checkout')}
            >
              Proceder al Pago
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
