import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, User, Music, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import productsData from '@/data/products.json';

const categorias = [
  'Todas',
  'Guitarras',
  'Bajos',
  'Baterías',
  'Teclados',
  'Estudio/Audio',
];

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products] = useState<Product[]>(productsData);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'Todas') {
      filtered = filtered.filter((p) => p.categoria === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b safe-area-top">
        <div className="container mx-auto px-3 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center shadow-glow">
                <Music className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Musiteca</span>
            </div>

            <div className="flex-1 max-w-xs mx-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-10 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <CartDrawer />
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => navigate('/perfil')}
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-2">
            ¡Bienvenido, {user?.name}!
          </h1>
          <p className="text-base opacity-90">
            Encuentra los mejores instrumentos musicales
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b bg-card">
        <div className="container mx-auto px-3 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categorias.map((categoria) => (
              <Badge
                key={categoria}
                variant={selectedCategory === categoria ? 'default' : 'outline'}
                className="cursor-pointer whitespace-nowrap px-3 py-2 text-sm min-h-[44px] flex items-center"
                onClick={() => setSelectedCategory(categoria)}
              >
                {categoria}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main className="container mx-auto px-3 py-4 pb-20">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-base">
              No se encontraron productos
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-3">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
