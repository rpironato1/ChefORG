// React Native Home Screen (Sprint 4 - First migrated screen)
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { NativeButton } from '../components/NativeButton';

// For now, we'll define constants locally since we don't have shared imports set up yet
const COLORS = {
  primary: {
    600: '#2563eb',
  },
  gray: {
    300: '#d1d5db',
    500: '#6b7280',
    700: '#374151',
    900: '#111827',
  },
};

const SPACING = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any; // Will be properly typed with React Navigation
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const destaques = [
    {
      titulo: 'Culinária Premium',
      descricao: 'Pratos elaborados com ingredientes frescos e técnicas refinadas',
      icon: '🍽️'
    },
    {
      titulo: 'Ambiente Acolhedor',
      descricao: 'Espaço elegante e confortável para momentos especiais',
      icon: '👥'
    },
    {
      titulo: 'Prêmios e Reconhecimentos',
      descricao: 'Reconhecido pela excelência em gastronomia e atendimento',
      icon: '🏆'
    }
  ];

  const avaliacoes = [
    {
      nome: 'Maria Silva',
      estrelas: 5,
      comentario: 'Experiência incrível! Comida deliciosa e atendimento excepcional.',
      data: '2 dias atrás'
    },
    {
      nome: 'João Santos',
      estrelas: 5,
      comentario: 'Ambiente maravilhoso e pratos surpreendentes. Voltarei com certeza!',
      data: '1 semana atrás'
    },
    {
      nome: 'Ana Costa',
      estrelas: 4,
      comentario: 'Ótima experiência gastronômica. Recomendo para ocasiões especiais.',
      data: '2 semanas atrás'
    }
  ];

  const renderEstrelas = (quantidade: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Text key={i} style={[styles.star, i < quantidade && styles.starFilled]}>
        ★
      </Text>
    ));
  };

  const handleReservarMesa = () => {
    // For now, just show an alert since we don't have navigation set up
    console.log('Navigate to Reserva');
  };

  const handleVerCardapio = () => {
    // For now, just show an alert since we don't have navigation set up
    console.log('Navigate to Menu');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.logo}>🍽️ ChefORG</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Bem-vindos ao ChefORG</Text>
            <Text style={styles.heroSubtitle}>
              Uma experiência gastronômica única que combina sabores excepcionais 
              com um ambiente sofisticado e acolhedor.
            </Text>
            
            <View style={styles.heroButtons}>
              <NativeButton
                title="📅 Reservar Mesa"
                onPress={handleReservarMesa}
                variant="primary"
                size="large"
              />
              <View style={styles.buttonSpacer} />
              <NativeButton
                title="Ver Cardápio"
                onPress={handleVerCardapio}
                variant="secondary"
                size="large"
              />
            </View>
          </View>
        </View>

        {/* Destaques Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Por que escolher o ChefORG?</Text>
          <Text style={styles.sectionSubtitle}>
            Oferecemos uma experiência gastronômica completa, onde cada detalhe 
            é pensado para proporcionar momentos inesquecíveis.
          </Text>
          
          <View style={styles.destaquesContainer}>
            {destaques.map((destaque, index) => (
              <View key={index} style={styles.destaqueCard}>
                <Text style={styles.destaqueIcon}>{destaque.icon}</Text>
                <Text style={styles.destaqueTitulo}>{destaque.titulo}</Text>
                <Text style={styles.destaqueDescricao}>{destaque.descricao}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Avaliações Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O que nossos clientes dizem</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.avaliacoesContainer}
          >
            {avaliacoes.map((avaliacao, index) => (
              <View key={index} style={styles.avaliacaoCard}>
                <View style={styles.avaliacaoHeader}>
                  <Text style={styles.avaliacaoNome}>{avaliacao.nome}</Text>
                  <View style={styles.estrelasContainer}>
                    {renderEstrelas(avaliacao.estrelas)}
                  </View>
                </View>
                <Text style={styles.avaliacaoComentario}>{avaliacao.comentario}</Text>
                <Text style={styles.avaliacaoData}>{avaliacao.data}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Informações Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoText}>Rua das Palmeiras, 123 - Centro</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📞</Text>
              <Text style={styles.infoText}>(11) 99999-9999</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🕒</Text>
              <Text style={styles.infoText}>Seg-Dom: 18:00 - 23:00</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    paddingHorizontal: SPACING.md,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary[600],
  },
  heroSection: {
    backgroundColor: COLORS.primary[600],
    paddingVertical: SPACING.xxl,
  },
  heroContent: {
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: SPACING.xl,
    opacity: 0.9,
  },
  heroButtons: {
    width: '100%',
    paddingHorizontal: SPACING.md,
  },
  buttonSpacer: {
    height: SPACING.md,
  },
  section: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.gray[500],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  destaquesContainer: {
    gap: SPACING.lg,
  },
  destaqueCard: {
    backgroundColor: '#f9fafb',
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  destaqueIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  destaqueTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  destaqueDescricao: {
    fontSize: 14,
    color: COLORS.gray[500],
    textAlign: 'center',
    lineHeight: 20,
  },
  avaliacoesContainer: {
    paddingLeft: SPACING.md,
  },
  avaliacaoCard: {
    backgroundColor: '#f9fafb',
    padding: SPACING.md,
    borderRadius: 12,
    width: width * 0.8,
    marginRight: SPACING.md,
  },
  avaliacaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avaliacaoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  estrelasContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 16,
    color: COLORS.gray[300],
  },
  starFilled: {
    color: '#fbbf24',
  },
  avaliacaoComentario: {
    fontSize: 14,
    color: COLORS.gray[700],
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  avaliacaoData: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  infoContainer: {
    gap: SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.gray[700],
  },
});