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
    ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import { TravelItem, useStore } from '../../store/useStore';

const ITEM_CATEGORIES = [
  'Roupas',
  'Documentos',
  'Eletrônicos',
  'Higiene',
  'Medicamentos',
  'Outros',
];

export default function ItemsScreen() {
  const { travelItems, addTravelItem, updateTravelItem, deleteTravelItem, toggleTravelItemPacked } = useStore();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<TravelItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: ITEM_CATEGORIES[0],
    quantity: '1',
    notes: '',
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o nome do item.');
      return;
    }

    if (editingItem) {
      updateTravelItem(editingItem.id, {
        name: formData.name,
        category: formData.category,
        quantity: parseInt(formData.quantity) || 1,
        notes: formData.notes,
      });
    } else {
      addTravelItem({
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        quantity: parseInt(formData.quantity) || 1,
        notes: formData.notes,
        isPacked: false,
      });
    }

    setModalVisible(false);
    resetForm();
  };

  const handleEdit = (item: TravelItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      notes: item.notes || '',
    });
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: () => deleteTravelItem(id), style: 'destructive' },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: ITEM_CATEGORIES[0],
      quantity: '1',
      notes: '',
    });
    setEditingItem(null);
  };

  const renderItem = ({ item }: { item: TravelItem }) => (
    <View style={styles.itemCard}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleTravelItemPacked(item.id)}>
        <FontAwesome
          name={item.isPacked ? 'check-square-o' : 'square-o'}
          size={24}
          color={item.isPacked ? theme.colors.primary : theme.colors.textLight}
        />
      </TouchableOpacity>

      <View style={styles.itemInfo}>
        <Text style={[
          styles.itemName,
          item.isPacked && styles.itemNamePacked
        ]}>
          {item.name}
        </Text>
        <View style={styles.itemDetails}>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <Text style={styles.itemQuantity}>Qtd: {item.quantity}</Text>
        </View>
        {item.notes && (
          <Text style={styles.itemNotes} numberOfLines={2}>
            {item.notes}
          </Text>
        )}
      </View>

      <View style={styles.itemActions}>
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
  );

  const groupedItems = travelItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, TravelItem[]>);

  const renderSection = ({ item: category }: { item: string }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{category}</Text>
      {groupedItems[category].map((item) => (
        <View key={item.id}>{renderItem({ item })}</View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bagagem do Capitão</Text>
      </View>

      <FlatList
        data={ITEM_CATEGORIES.filter(category => groupedItems[category]?.length > 0)}
        renderItem={renderSection}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="suitcase" size={48} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>Nenhum item na bagagem, capitão!</Text>
            <Text style={styles.emptySubtext}>Toque no botão + para adicionar um novo item</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: 32 + insets.bottom }]}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Adicionar item"
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
          resetForm();
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Editar Item' : 'Novo Item'}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Nome do Item"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <View style={styles.categoryContainer}>
                <Text style={styles.label}>Categoria:</Text>
                <View style={styles.categoryButtons}>
                  {ITEM_CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryButton,
                        formData.category === category && styles.categoryButtonSelected,
                      ]}
                      onPress={() => setFormData({ ...formData, category })}>
                      <Text
                        style={[
                          styles.categoryButtonText,
                          formData.category === category && styles.categoryButtonTextSelected,
                        ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Quantidade"
                value={formData.quantity}
                onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                keyboardType="numeric"
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Observações"
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                multiline
                numberOfLines={4}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSubmit}>
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
  section: {
    marginBottom: theme.spacing.lg,
  } as ViewStyle,
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  } as TextStyle,
  itemCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.small,
  } as ViewStyle,
  checkbox: {
    marginRight: theme.spacing.md,
  } as ViewStyle,
  itemInfo: {
    flex: 1,
  } as ViewStyle,
  itemName: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
  } as TextStyle,
  itemNamePacked: {
    textDecorationLine: 'line-through',
    color: theme.colors.textLight,
  } as TextStyle,
  itemDetails: {
    flexDirection: 'row',
    marginTop: theme.spacing.xs,
  } as ViewStyle,
  itemCategory: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.primary,
    marginRight: theme.spacing.md,
  } as TextStyle,
  itemQuantity: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textLight,
  } as TextStyle,
  itemNotes: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  } as TextStyle,
  itemActions: {
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
  categoryContainer: {
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  label: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  } as TextStyle,
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  } as ViewStyle,
  categoryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  } as ViewStyle,
  categoryButtonSelected: {
    backgroundColor: theme.colors.primary,
  } as ViewStyle,
  categoryButtonText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.primary,
  } as TextStyle,
  categoryButtonTextSelected: {
    color: theme.colors.white,
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
}); 