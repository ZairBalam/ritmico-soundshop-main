import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, User as UserIcon, LogOut } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Order } from '@/types';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('musiteca_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const getEstadoColor = (estado: Order['estado']) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-warning/10 text-warning border-warning';
      case 'procesando':
        return 'bg-blue-500/10 text-blue-500 border-blue-500';
      case 'enviado':
        return 'bg-accent/10 text-accent border-accent';
      case 'entregado':
        return 'bg-success/10 text-success border-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
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

        <div className="space-y-4">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Mi Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-semibold text-lg">{user?.name}</p>
                
                <p className="text-sm text-muted-foreground mt-4">Email</p>
                <p className="font-semibold">{user?.email}</p>

                <div className="pt-4">
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Mis Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Aún no tienes pedidos</p>
                  <Button className="mt-4" onClick={() => navigate('/')}>
                    Explorar productos
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.reverse().map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Pedido #{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.fecha)}
                          </p>
                        </div>
                        <Badge variant="outline" className={getEstadoColor(order.estado)}>
                          {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {order.productos.map((item) => (
                          <div key={item.product.id} className="flex gap-3 text-sm">
                            <img
                              src={item.product.imagenes[0]}
                              alt={item.product.nombre}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.product.nombre}</p>
                              <p className="text-muted-foreground">Cantidad: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-primary">
                              {formatCurrency(item.product.precio * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-3 flex justify-between font-bold">
                        <span>Total:</span>
                        <span className="text-primary">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
