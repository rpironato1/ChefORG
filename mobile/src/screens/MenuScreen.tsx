// Menu Screen for React Native app
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { NativeButton } from '../components/NativeButton';

// For now, we'll use shared constants
const COLORS = {
  primary: {
    600: '#2563eb',
    700: '#1d4ed8',
  },
  gray: {
    100: '#f3f4f6',
    300: '#d1d5db',
    500: '#6b7280',
    700: '#374151',
    900: '#111827',
  },
  green: {
    600: '#16a34a',
  },
  red: {
    600: '#dc2626',
  },
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

interface MenuItem {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria_id: number;
  ativo: boolean;
  imagem?: string;
}

interface MenuCategory {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

interface MenuScreenProps {
  navigation: any;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({});

  // Mock data - In production, this would come from the shared API layer
  useEffect(() => {
    const mockCategories: MenuCategory[] = [
      { id: 1, nome: 'Pizzas', ativo: true },
      { id: 2, nome: 'Hambúrguers', ativo: true },
      { id: 3, nome: 'Bebidas', ativo: true },
      { id: 4, nome: 'Sobremesas', ativo: true },
    ];

    const mockMenuItems: MenuItem[] = [
      {
        id: 1,
        nome: 'Pizza Margherita',
        descricao: 'Molho de tomate, mussarela, manjericão fresco',
        preco: 28.90,
        categoria_id: 1,
        ativo: true,
      },
      {
        id: 2,
        nome: 'Pizza Pepperoni',
        descricao: 'Molho de tomate, mussarela, pepperoni',
        preco: 32.90,
        categoria_id: 1,
        ativo: true,
      },
      {
        id: 3,
        nome: 'Hambúrguer Artesanal',
        descricao: 'Carne 180g, queijo, alface, tomate, cebola caramelizada',
        preco: 24.90,
        categoria_id: 2,
        ativo: true,
      },
      {
        id: 4,
        nome: 'Refrigerante Lata',
        descricao: 'Coca-Cola, Pepsi, Sprite, Fanta',
        preco: 4.50,
        categoria_id: 3,
        ativo: true,
      },
      {
        id: 5,
        nome: 'Brownie com Sorvete',
        descricao: 'Brownie de chocolate com sorvete de baunilha',
        preco: 12.90,
        categoria_id: 4,
        ativo: true,
      },
    ];

    setCategories(mockCategories);
    setMenuItems(mockMenuItems);
    setLoading(false);
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory ? item.categoria_id === selectedCategory : true;
    const matchesSearch = item.nome.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.descricao.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch && item.ativo;
  });

  const addToCart = (itemId: number) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));
  };

  const getCartTotal = () => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find(i => i.id === parseInt(itemId));
      return total + (item ? item.preco * quantity : 0);
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => {
    const quantity = cartItems[item.id] || 0;

    return (
      <View style={styles.menuItem}>
        <View style={styles.menuItemContent}>
          <View style={styles.menuItemInfo}>
            <Text style={styles.menuItemName}>{item.nome}</Text>
            <Text style={styles.menuItemDescription}>{item.descricao}</Text>
            <Text style={styles.menuItemPrice}>
              R$ {item.preco.toFixed(2).replace('.', ',')}
            </Text>
          </View>
          
          <View style={styles.menuItemActions}>
            {quantity > 0 ? (
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={[styles.quantityButton, styles.decreaseButton]}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{quantity}</Text>
                
                <TouchableOpacity
                  style={[styles.quantityButton, styles.increaseButton]}
                  onPress={() => addToCart(item.id)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addToCart(item.id)}
              >
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderCategoryButton = (category: MenuCategory) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.categoryButtonActive,
      ]}
      onPress={() => setSelectedCategory(
        selectedCategory === category.id ? null : category.id
      )}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === category.id && styles.categoryButtonTextActive,
        ]}
      >
        {category.nome}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text style={styles.loadingText}>Carregando cardápio...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar no cardápio..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(renderCategoryButton)}
      </ScrollView>

      {/* Menu Items */}
      <FlatList
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.menuList}
        showsVerticalScrollIndicator={false}
      />

      {/* Cart Summary */}
      {getTotalItems() > 0 && (
        <View style={styles.cartSummary}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartItemCount}>
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'}
            </Text>
            <Text style={styles.cartTotal}>
              R$ {getCartTotal().toFixed(2).replace('.', ',')}
            </Text>
          </View>
          
          <NativeButton
            title="Ver Carrinho"
            onPress={() => navigation.navigate('Orders')}
            variant="primary"
            size="medium"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.gray[500],
  },
  searchContainer: {
    padding: SPACING.md,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
  },
  categoriesContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  categoriesContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  categoryButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary[600],
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray[700],
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  menuList: {
    padding: SPACING.md,
  },
  menuItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemContent: {
    padding: SPACING.md,
  },
  menuItemInfo: {
    marginBottom: SPACING.md,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  menuItemDescription: {
    fontSize: 14,
    color: COLORS.gray[500],
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary[600],
  },
  menuItemActions: {
    alignItems: 'flex-end',
  },
  addButton: {
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decreaseButton: {
    backgroundColor: COLORS.red[600],
  },
  increaseButton: {
    backgroundColor: COLORS.green[600],
  },
  quantityButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  quantityText: {
    marginHorizontal: SPACING.md,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  cartSummary: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartInfo: {
    flex: 1,
  },
  cartItemCount: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
});