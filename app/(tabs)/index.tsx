import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Tooltip } from '../../components/Tooltip';
import { theme } from '../../constants/theme';
import { useStore } from '../../store/useStore';

export default function HomeScreen() {
  const { destinations, itinerary, expenses } = useStore();
  const [showTooltips, setShowTooltips] = useState({
    welcome: false,
    destinations: false,
    itinerary: false,
    budget: false,
  });

  useEffect(() => {
    checkFirstTimeUser();
  }, []);

  const checkFirstTimeUser = async () => {
    try {
      const hasSeenTooltips = await AsyncStorage.getItem('hasSeenTooltips');
      if (!hasSeenTooltips) {
        setShowTooltips({
          welcome: true,
          destinations: false,
          itinerary: false,
          budget: false,
        });
        await AsyncStorage.setItem('hasSeenTooltips', 'true');
      }
    } catch (error) {
      console.error('Error checking first time user:', error);
    }
  };

  const handleTooltipClose = (tooltip: keyof typeof showTooltips) => {
    setShowTooltips(prev => ({
      ...prev,
      [tooltip]: false,
    }));

    if (tooltip === 'welcome') {
      setShowTooltips(prev => ({ ...prev, destinations: true }));
    } else if (tooltip === 'destinations') {
      setShowTooltips(prev => ({ ...prev, itinerary: true }));
    } else if (tooltip === 'itinerary') {
      setShowTooltips(prev => ({ ...prev, budget: true }));
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const upcomingTrips = destinations.length;
  const plannedDays = itinerary.length;
  const totalActivities = itinerary.reduce((sum, day) => sum + day.activities.length, 0);

  // Get next 3 upcoming destinations
  const upcomingDestinations = destinations.slice(0, 3);

  // Get next 3 activities from itinerary
  const nextActivities = itinerary
    .flatMap(day => day.activities.map(activity => ({ ...activity, date: day.date })))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Get recent expenses
  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Navegação do Capitão</Text>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumo da Viagem</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesome name="map-marker" size={24} color={theme.colors.primary} />
            <Text style={styles.statNumber}>{upcomingTrips}</Text>
            <Text style={styles.statLabel}>Tesouros</Text>
          </View>

          <View style={styles.statItem}>
            <FontAwesome name="compass" size={24} color={theme.colors.secondary} />
            <Text style={styles.statNumber}>{plannedDays}</Text>
            <Text style={styles.statLabel}>Dias</Text>
          </View>

          <View style={styles.statItem}>
            <FontAwesome name="list" size={24} color={theme.colors.accent} />
            <Text style={styles.statNumber}>{totalActivities}</Text>
            <Text style={styles.statLabel}>Atividades</Text>
          </View>

          <View style={styles.statItem}>
            <FontAwesome name="money" size={24} color={theme.colors.error} />
            <Text style={styles.statNumber}>R$ {totalExpenses.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Upcoming Destinations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximos Tesouros</Text>
        {upcomingDestinations.length > 0 ? (
          upcomingDestinations.map((destination) => (
            <View key={destination.id} style={styles.destinationCard}>
              <View style={styles.destinationInfo}>
                <Text style={styles.destinationName}>{destination.name}</Text>
                <Text style={styles.destinationLocation}>{destination.location}</Text>
                {destination.description && (
                  <Text style={styles.destinationDescription} numberOfLines={2}>
                    {destination.description}
                  </Text>
                )}
              </View>
              <Link href={`/destinations?id=${destination.id}`} asChild>
                <TouchableOpacity style={styles.viewButton}>
                  <FontAwesome name="chevron-right" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              </Link>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum tesouro encontrado, capitão!</Text>
        )}
      </View>

      {/* Next Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximas Atividades</Text>
        {nextActivities.length > 0 ? (
          nextActivities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDetails}>
                  {activity.time} • {activity.location}
                </Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhuma atividade planejada, capitão!</Text>
        )}
      </View>

      {/* Recent Expenses */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Últimas Despesas</Text>
        {recentExpenses.length > 0 ? (
          recentExpenses.map((expense) => (
            <View key={expense.id} style={styles.expenseCard}>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseDescription}>{expense.description}</Text>
                <Text style={styles.expenseCategory}>{expense.category}</Text>
              </View>
              <Text style={styles.expenseAmount}>R$ {expense.amount.toFixed(2)}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhuma despesa registrada, capitão!</Text>
        )}
      </View>

      {/* Tooltips */}
      {showTooltips.welcome && (
        <Tooltip
          title="Bem-vindo, Capitão!"
          message="Este é seu mapa do tesouro digital. Aqui você pode planejar suas aventuras, registrar seus tesouros e manter o controle de sua pilhagem."
          onClose={() => handleTooltipClose('welcome')}
        />
      )}

      {showTooltips.destinations && (
        <Tooltip
          title="Tesouros"
          message="Registre os locais que deseja explorar. Cada tesouro pode ter uma descrição e localização específica."
          onClose={() => handleTooltipClose('destinations')}
        />
      )}

      {showTooltips.itinerary && (
        <Tooltip
          title="Rotas"
          message="Planeje seus dias de navegação com atividades e horários. Mantenha seu rumo organizado!"
          onClose={() => handleTooltipClose('itinerary')}
        />
      )}

      {showTooltips.budget && (
        <Tooltip
          title="Pilhagem"
          message="Registre seus gastos e ganhos. Todo bom capitão precisa manter o controle de seu tesouro!"
          onClose={() => handleTooltipClose('budget')}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
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
  summaryCard: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
  },
  summaryTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  } as TextStyle,
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  } as ViewStyle,
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.small,
  } as ViewStyle,
  statNumber: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  } as TextStyle,
  statLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  } as TextStyle,
  section: {
    padding: theme.spacing.lg,
  } as ViewStyle,
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  } as TextStyle,
  destinationCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...theme.shadows.small,
  } as ViewStyle,
  destinationInfo: {
    flex: 1,
  } as ViewStyle,
  destinationName: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
  } as TextStyle,
  destinationLocation: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  } as TextStyle,
  destinationDescription: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  } as TextStyle,
  viewButton: {
    padding: theme.spacing.sm,
  } as ViewStyle,
  activityCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  } as ViewStyle,
  activityInfo: {
    flex: 1,
  } as ViewStyle,
  activityTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
  } as TextStyle,
  activityDetails: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  } as TextStyle,
  activityDate: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  } as TextStyle,
  expenseCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...theme.shadows.small,
  } as ViewStyle,
  expenseInfo: {
    flex: 1,
  } as ViewStyle,
  expenseDescription: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
  } as TextStyle,
  expenseCategory: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  } as TextStyle,
  expenseAmount: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    color: theme.colors.error,
  } as TextStyle,
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textLight,
    fontStyle: 'italic',
    fontSize: theme.typography.body.fontSize,
  } as TextStyle,
});
