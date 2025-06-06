import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { theme } from '../../constants/theme';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sobre o App</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <FontAwesome name="ship" size={80} color={theme.colors.primary} />
            <Text style={styles.appName}>WanderMobile</Text>
            <Text style={styles.version}>Versão 1.0.0</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bem-vindo, Capitão!</Text>
            <Text style={styles.description}>
              Este é seu diário de bordo digital para registrar todas as suas aventuras e descobertas pelo mundo.
              Organize seus destinos, planeje seu roteiro, registre suas memórias e mantenha o controle do seu tesouro.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recursos Principais</Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <FontAwesome name="map-marker" size={24} color={theme.colors.primary} />
                <Text style={styles.featureText}>Destinos: Gerencie seus destinos favoritos</Text>
              </View>
              <View style={styles.featureItem}>
                <FontAwesome name="compass" size={24} color={theme.colors.primary} />
                <Text style={styles.featureText}>Roteiro de Viagem: Planeje seu roteiro diário</Text>
              </View>
              <View style={styles.featureItem}>
                <FontAwesome name="suitcase" size={24} color={theme.colors.primary} />
                <Text style={styles.featureText}>Bagagem: Organize seus itens de viagem</Text>
              </View>
              <View style={styles.featureItem}>
                <FontAwesome name="camera" size={24} color={theme.colors.primary} />
                <Text style={styles.featureText}>Memórias da Viagem: Registre momentos especiais</Text>
              </View>
              <View style={styles.featureItem}>
                <FontAwesome name="money" size={24} color={theme.colors.primary} />
                <Text style={styles.featureText}>Gastos: Controle suas despesas</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Desenvolvido com</Text>
            <View style={styles.techList}>
              <Text style={styles.techItem}>⚓ React Native</Text>
              <Text style={styles.techItem}>🗺️ Expo</Text>
              <Text style={styles.techItem}>⚔️ TypeScript</Text>
              <Text style={styles.techItem}>🏴‍☠️ Zustand</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2024 WanderMobile - Todos os direitos reservados
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as ViewStyle,
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    alignItems: 'center',
  } as ViewStyle,
  title: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
  } as TextStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    flexGrow: 1,
  } as ViewStyle,
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  } as ViewStyle,
  logoContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  } as ViewStyle,
  appName: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: theme.spacing.md,
  } as TextStyle,
  version: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  } as TextStyle,
  section: {
    marginBottom: theme.spacing.xl,
  } as ViewStyle,
  sectionTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  } as TextStyle,
  description: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    lineHeight: 24,
  } as TextStyle,
  featureList: {
    gap: theme.spacing.md,
  } as ViewStyle,
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  } as ViewStyle,
  featureText: {
    flex: 1,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  } as TextStyle,
  techList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  } as ViewStyle,
  techItem: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  } as TextStyle,
  footer: {
    marginTop: 'auto',
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  } as ViewStyle,
  footerText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textLight,
    textAlign: 'center',
  } as TextStyle,
}); 