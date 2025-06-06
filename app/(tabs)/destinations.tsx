import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import { useStore } from '../../store/useStore';

export default function DestinationsScreen() {
  const { destinations, addDestination, updateDestination, deleteDestination } = useStore();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDestination, setEditingDestination] = useState<{ id: string; name: string; location: string } | null>(null);
  const [formData, setFormData] = useState({ name: '', location: '' });

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.location.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    if (editingDestination) {
      updateDestination(editingDestination.id, {
        name: formData.name,
        location: formData.location,
        description: '',
      });
    } else {
      addDestination({
        id: Date.now().toString(),
        name: formData.name,
        location: formData.location,
        description: '',
      });
    }

    setModalVisible(false);
    setEditingDestination(null);
    setFormData({ name: '', location: '' });
  };

  const handleEdit = (destination: { id: string; name: string; location: string }) => {
    setEditingDestination(destination);
    setFormData({ name: destination.name, location: destination.location });
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este destino?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: () => deleteDestination(id), style: 'destructive' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Destinos</Text>
      </View>

      <ScrollView style={styles.content}>
        {destinations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome name="map-marker" size={48} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>Nenhum tesouro encontrado, capitão!</Text>
            <Text style={styles.emptySubtext}>Toque no botão + para adicionar um novo destino</Text>
          </View>
        ) : (
          destinations.map((destination) => (
            <View key={destination.id} style={styles.destinationCard}>
              <View style={styles.destinationInfo}>
                <Text style={styles.destinationName}>{destination.name}</Text>
                <Text style={styles.destinationLocation}>{destination.location}</Text>
              </View>
              <View style={styles.destinationActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEdit(destination)}>
                  <FontAwesome name="pencil" size={20} color={theme.colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(destination.id)}>
                  <FontAwesome name="trash" size={20} color={theme.colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { bottom: 32 + insets.bottom }]}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Adicionar destino"
        accessibilityRole="button"
      >
        <FontAwesome name="plus" size={28} color={theme.colors.white} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setEditingDestination(null);
          setFormData({ name: '', location: '' });
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingDestination ? 'Editar Tesouro' : 'Novo Tesouro'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do Destino"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Localização"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setEditingDestination(null);
                  setFormData({ name: '', location: '' });
                }}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
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
  content: {
    flex: 1,
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
  destinationCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
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
  destinationActions: {
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
}); 