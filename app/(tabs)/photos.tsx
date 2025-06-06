import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageStyle,
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
import { Photo, useStore } from '../../store/useStore';

export default function PhotosScreen() {
  const { photos, addPhoto, deletePhoto } = useStore();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const [formData, setFormData] = useState({
    caption: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Atenção', 'Precisamos de permissão para acessar suas fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleSubmit(result.assets[0].uri);
    }
  };

  const handleSubmit = (imageUri: string) => {
    if (!formData.caption) {
      Alert.alert('Atenção', 'Legenda é obrigatória');
      return;
    }

    addPhoto({
      id: Date.now().toString(),
      url: imageUri,
      ...formData,
    });

    setModalVisible(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: () => deletePhoto(id), style: 'destructive' },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      caption: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
    });
    setSelectedPhoto(null);
  };

  const renderPhotoItem = ({ item }: { item: Photo }) => (
    <View style={styles.photoCard}>
      <Image source={{ uri: item.url }} style={styles.photo} />
      <View style={styles.photoInfo}>
        <Text style={styles.photoCaption}>{item.caption}</Text>
        <Text style={styles.photoLocation}>{item.location}</Text>
        <Text style={styles.photoDate}>{item.date}</Text>
      </View>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => handleDelete(item.id)}>
        <FontAwesome name="trash" size={20} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Memórias da Viagem</Text>
      </View>

      <FlatList
        data={photos}
        renderItem={renderPhotoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="camera" size={48} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>Nenhuma memória registrada, capitão!</Text>
            <Text style={styles.emptySubtext}>Toque no botão + para adicionar uma nova foto</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: 32 + insets.bottom }]}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Adicionar foto"
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
            <Text style={styles.modalTitle}>Nova Memória</Text>

            <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
              <FontAwesome name="camera" size={24} color={theme.colors.white} />
              <Text style={styles.buttonText}>Escolher Foto</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Legenda"
              value={formData.caption}
              onChangeText={(text) => setFormData({ ...formData, caption: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Local"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
            />

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
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedPhoto}
        onRequestClose={() => setSelectedPhoto(null)}>
        <View style={styles.photoModalContainer}>
          {selectedPhoto && (
            <ScrollView style={styles.photoModalContent}>
              <Image
                source={{ uri: selectedPhoto.url }}
                style={styles.photoFull}
                resizeMode="contain"
              />
              <View style={styles.photoDetails}>
                <Text style={styles.photoFullCaption}>{selectedPhoto.caption}</Text>
                {selectedPhoto.location && (
                  <Text style={styles.photoFullLocation}>
                    <FontAwesome name="map-marker" size={16} color="#666" />{' '}
                    {selectedPhoto.location}
                  </Text>
                )}
                <Text style={styles.photoFullDate}>
                  <FontAwesome name="calendar" size={16} color="#666" />{' '}
                  {selectedPhoto.date}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedPhoto(null)}>
                <FontAwesome name="times" size={24} color="#fff" />
              </TouchableOpacity>
            </ScrollView>
          )}
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
  photoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.small,
  } as ViewStyle,
  photo: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  } as ImageStyle,
  photoInfo: {
    padding: theme.spacing.md,
  } as ViewStyle,
  photoCaption: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
  } as TextStyle,
  photoLocation: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  } as TextStyle,
  photoDate: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  } as TextStyle,
  actionButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  pickImageButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  } as ViewStyle,
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
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: theme.spacing.sm,
  } as TextStyle,
  photoModalContainer: {
    flex: 1,
    backgroundColor: '#000',
  } as ViewStyle,
  photoModalContent: {
    flex: 1,
  } as ViewStyle,
  photoFull: {
    width: '100%',
    height: 400,
  } as ImageStyle,
  photoDetails: {
    padding: 20,
    backgroundColor: '#fff',
  } as ViewStyle,
  photoFullCaption: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  } as TextStyle,
  photoFullLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  } as TextStyle,
  photoFullDate: {
    fontSize: 16,
    color: '#666',
  } as TextStyle,
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  } as ViewStyle,
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