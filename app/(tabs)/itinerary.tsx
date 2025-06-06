import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import { Activity, ItineraryDay, useStore } from '../../store/useStore';

export default function ItineraryScreen() {
  const { itinerary, addItineraryDay, updateItineraryDay, deleteItineraryDay } = useStore();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDay, setEditingDay] = useState<ItineraryDay | null>(null);
  const [selectedDay, setSelectedDay] = useState<ItineraryDay | null>(null);

  const [formData, setFormData] = useState({
    date: '',
    activities: [] as Activity[],
  });

  const [activityForm, setActivityForm] = useState({
    title: '',
    description: '',
    time: '',
    location: '',
  });

  const handleSubmit = () => {
    if (!formData.date) {
      Alert.alert('Atenção', 'Data é obrigatória');
      return;
    }

    if (editingDay) {
      updateItineraryDay(editingDay.id, formData);
    } else {
      addItineraryDay({
        id: Date.now().toString(),
        ...formData,
      });
    }

    setModalVisible(false);
    resetForm();
  };

  const handleEdit = (day: ItineraryDay) => {
    setEditingDay(day);
    setFormData({
      date: day.date,
      activities: day.activities,
    });
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este dia do roteiro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: () => deleteItineraryDay(id), style: 'destructive' },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      date: '',
      activities: [],
    });
    setEditingDay(null);
  };

  const addActivity = () => {
    if (!activityForm.title || !activityForm.time) {
      Alert.alert('Atenção', 'Título e horário são obrigatórios');
      return;
    }

    const newActivity: Activity = {
      id: Date.now().toString(),
      ...activityForm,
    };

    setFormData({
      ...formData,
      activities: [...formData.activities, newActivity],
    });

    setActivityForm({
      title: '',
      description: '',
      time: '',
      location: '',
    });
  };

  const removeActivity = (activityId: string) => {
    setFormData({
      ...formData,
      activities: formData.activities.filter((a) => a.id !== activityId),
    });
  };

  const renderDayItem = ({ item }: { item: ItineraryDay }) => (
    <TouchableOpacity
      style={styles.dayCard}
      onPress={() => setSelectedDay(item)}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayDate}>{item.date}</Text>
        <View style={styles.dayActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEdit(item)}>
            <FontAwesome name="pencil" size={20} color={theme.colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item.id)}>
            <FontAwesome name="trash" size={20} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.dayFooter}>
        <Text style={styles.activityCount}>
          {item.activities.length} atividades planejadas
        </Text>
        <FontAwesome name="chevron-right" size={16} color={theme.colors.primary} />
      </View>
    </TouchableOpacity>
  );

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => removeActivity(item.id)}>
        <FontAwesome name="trash" size={16} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Roteiro de Viagem</Text>
      </View>

      {selectedDay ? (
        <View style={styles.selectedDayContainer}>
          <View style={styles.selectedDayHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedDay(null)}>
              <FontAwesome name="arrow-left" size={20} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.selectedDayTitle}>{selectedDay.date}</Text>
          </View>
          <FlatList
            data={selectedDay.activities}
            renderItem={renderActivityItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.activitiesList}
          />
        </View>
      ) : (
        <FlatList
          data={itinerary}
          renderItem={renderDayItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome name="compass" size={48} color={theme.colors.textLight} />
              <Text style={styles.emptyText}>Nenhuma rota planejada, capitão!</Text>
              <Text style={styles.emptySubtext}>Toque no botão + para adicionar um novo dia</Text>
            </View>
          }
        />
      )}

      {!selectedDay && (
        <TouchableOpacity
          style={[styles.fab, { bottom: 32 + insets.bottom }]}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Adicionar dia ao roteiro"
          accessibilityRole="button"
        >
          <FontAwesome name="plus" size={28} color={theme.colors.white} />
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
              <Text style={styles.modalTitle}>
                {editingDay ? 'Editar Dia' : 'Novo Dia'}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Data (DD/MM/AAAA)"
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
              />

              <View style={styles.activitySection}>
                <Text style={styles.sectionTitle}>Atividades do Dia</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Título da Atividade"
                  value={activityForm.title}
                  onChangeText={(text) => setActivityForm({ ...activityForm, title: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Horário"
                  value={activityForm.time}
                  onChangeText={(text) => setActivityForm({ ...activityForm, time: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Local"
                  value={activityForm.location}
                  onChangeText={(text) => setActivityForm({ ...activityForm, location: text })}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Descrição"
                  value={activityForm.description}
                  onChangeText={(text) => setActivityForm({ ...activityForm, description: text })}
                  multiline
                  numberOfLines={4}
                />
                <TouchableOpacity style={styles.addActivityButton} onPress={addActivity}>
                  <Text style={styles.buttonText}>Adicionar Atividade</Text>
                </TouchableOpacity>
              </View>

              {formData.activities.length > 0 && (
                <View style={styles.activitiesList}>
                  {formData.activities.map((activity) => (
                    <View key={activity.id} style={styles.activityItem}>
                      <View style={styles.activityInfo}>
                        <Text style={styles.activityTitle}>{activity.title}</Text>
                        <Text style={styles.activityTime}>{activity.time}</Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => removeActivity(activity.id)}>
                        <FontAwesome name="trash" size={16} color={theme.colors.white} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  listContainer: {
    padding: theme.spacing.lg,
  } as ViewStyle,
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  } as ViewStyle,
  emptyText: {
    fontSize: theme.typography.h3.fontSize,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  } as TextStyle,
  emptySubtext: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  } as TextStyle,
  dayCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  } as ViewStyle,
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  dayDate: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
  } as TextStyle,
  dayActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  } as ViewStyle,
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  editButton: {
    backgroundColor: theme.colors.secondary,
  } as ViewStyle,
  deleteButton: {
    backgroundColor: theme.colors.error,
  } as ViewStyle,
  activityCount: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
  } as TextStyle,
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  } as ViewStyle,
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    ...theme.shadows.medium,
  } as ViewStyle,
  modalTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  } as TextStyle,
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  } as TextStyle,
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  } as TextStyle,
  activitySection: {
    marginTop: theme.spacing.md,
  } as ViewStyle,
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  } as TextStyle,
  addActivityButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  activitiesList: {
    marginTop: theme.spacing.md,
  } as ViewStyle,
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  } as ViewStyle,
  activityInfo: {
    flex: 1,
  } as ViewStyle,
  activityTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
  } as TextStyle,
  activityTime: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  } as TextStyle,
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  } as ViewStyle,
  modalButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
  } as ViewStyle,
  cancelButton: {
    backgroundColor: theme.colors.textLight,
  } as ViewStyle,
  saveButton: {
    backgroundColor: theme.colors.primary,
  } as ViewStyle,
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    textAlign: 'center',
  } as TextStyle,
  selectedDayContainer: {
    flex: 1,
  } as ViewStyle,
  selectedDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  } as ViewStyle,
  backButton: {
    marginRight: 15,
  } as ViewStyle,
  selectedDayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  } as TextStyle,
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    ...theme.shadows.medium,
  } as ViewStyle,
  dayFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
  } as ViewStyle,
}); 