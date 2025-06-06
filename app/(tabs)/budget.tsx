import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
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
import { Expense, useStore } from '../../store/useStore';

export default function BudgetScreen() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useStore();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const categories = [
    'Alimentação',
    'Hospedagem',
    'Transporte',
    'Atividades',
    'Compras',
    'Outros',
  ];

  const handleSubmit = () => {
    if (!formData.description || !formData.amount || !formData.category) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const amount = parseFloat(formData.amount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Atenção', 'Por favor, insira um valor válido');
      return;
    }

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        ...formData,
        amount,
      });
    } else {
      addExpense({
        id: Date.now().toString(),
        ...formData,
        amount,
      });
    }

    setModalVisible(false);
    resetForm();
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
    });
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta despesa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: () => deleteExpense(id), style: 'destructive' },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingExpense(null);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <View style={styles.expenseCard}>
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseDescription}>{item.description}</Text>
        <Text style={styles.expenseCategory}>{item.category}</Text>
        <Text style={styles.expenseDate}>{item.date}</Text>
      </View>
      <View style={styles.expenseActions}>
        <Text style={styles.expenseAmount}>
          R$ {item.amount.toFixed(2)}
        </Text>
        <View style={styles.actionButtons}>
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
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gastos</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total de Despesas</Text>
        <Text style={styles.summaryAmount}>R$ {totalExpenses.toFixed(2)}</Text>
        <View style={styles.categoryBreakdown}>
          {Object.entries(categoryTotals).map(([category, amount]) => (
            <View key={category} style={styles.categoryItem}>
              <Text style={styles.categoryName}>{category}</Text>
              <Text style={styles.categoryAmount}>R$ {amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="money" size={48} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>Nenhuma despesa registrada, capitão!</Text>
            <Text style={styles.emptySubtext}>Toque no botão + para adicionar uma nova despesa</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: 32 + insets.bottom }]}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Adicionar despesa"
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
            <Text style={styles.modalTitle}>
              {editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Valor"
              value={formData.amount}
              onChangeText={(text) => setFormData({ ...formData, amount: text })}
              keyboardType="decimal-pad"
            />

            <View style={styles.categoryContainer}>
              {categories.map((category) => (
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

            <TextInput
              style={styles.input}
              placeholder="Data (DD/MM/AAAA)"
              value={formData.date}
              onChangeText={(text) => setFormData({ ...formData, date: text })}
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
  summaryCard: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
  } as ViewStyle,
  summaryTitle: {
    fontSize: theme.typography.h3.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  } as TextStyle,
  summaryAmount: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  } as TextStyle,
  categoryBreakdown: {
    marginTop: theme.spacing.md,
  } as ViewStyle,
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  } as ViewStyle,
  categoryName: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  } as TextStyle,
  categoryAmount: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textLight,
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
  expenseCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...theme.shadows.small,
  } as ViewStyle,
  expenseInfo: {
    flex: 1,
  } as ViewStyle,
  expenseDescription: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
  } as TextStyle,
  expenseCategory: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  } as TextStyle,
  expenseDate: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  } as TextStyle,
  expenseActions: {
    alignItems: 'flex-end',
  } as ViewStyle,
  expenseAmount: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.primary,
  } as TextStyle,
  actionButtons: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
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
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  categoryButton: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  } as ViewStyle,
  categoryButtonSelected: {
    backgroundColor: theme.colors.primary,
  } as ViewStyle,
  categoryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.body.fontSize,
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