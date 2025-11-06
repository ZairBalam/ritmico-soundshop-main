import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totals, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    calle: '',
    ciudad: '',
    codigoPostal: '',
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
          <Button onClick={() => navigate('/')}>Ir a la tienda</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const orderId = Math.random().toString(36).substring(2, 9).toUpperCase();
    
    // Guardar orden en localStorage
    const orders = JSON.parse(localStorage.getItem('musiteca_orders') || '[]');
    const newOrder = {
      id: orderId,
      fecha: new Date().toISOString(),
      productos: items,
      ...totals,
      estado: 'pendiente',
      direccion: formData,
    };
    orders.push(newOrder);
    localStorage.setItem('musiteca_orders', JSON.stringify(orders));

    clearCart();
    setIsProcessing(false);
    
    toast.success(
      `¡Pedido #${orderId} confirmado!`,
      {
        description: 'Recibirás un email de confirmación pronto.',
        duration: 5000,
      }
    );
    
    navigate('/perfil');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-3 py-4 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-4 h-10"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <h1 className="text-xl font-bold mb-4">Checkout</h1>

        <div className="space-y-6">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Información de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre completo *</Label>
                      <Input
                        id="nombre"
                        required
                        className="h-11"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        type="tel"
                        required
                        className="h-11"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calle">Calle y número *</Label>
                    <Input
                      id="calle"
                      required
                      className="h-11"
                      value={formData.calle}
                      onChange={(e) => setFormData({ ...formData, calle: e.target.value })}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ciudad">Ciudad *</Label>
                      <Input
                        id="ciudad"
                        required
                        className="h-11"
                        value={formData.ciudad}
                        onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cp">Código Postal *</Label>
                      <Input
                        id="cp"
                        required
                        className="h-11"
                        value={formData.codigoPostal}
                        onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Método de Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pago simulado - No se realizará ningún cargo real
                  </p>
                  <div className="flex items-center gap-2 p-4 border rounded-lg bg-muted/50">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Tarjeta de Crédito/Débito</span>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                size="lg"
                className="w-full gradient-primary h-12 text-base"
                disabled={isProcessing}
              >
                {isProcessing ? 'Procesando...' : `Confirmar Pedido - ${formatCurrency(totals.total)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.imagenes[0]}
                        alt={item.product.nombre}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.nombre}</p>
                        <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                        <p className="text-sm font-semibold text-primary">
                          {formatCurrency(item.product.precio * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
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
                      {totals.envio === 0 ? '¡GRATIS!' : formatCurrency(totals.envio)}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(totals.total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
