import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

/** Opens the camera or photo library and returns the picked image's local URI. Stays on the phone. */
export async function pickPhoto(source: 'camera' | 'library'): Promise<string | undefined> {
  const permission =
    source === 'camera' ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permission needed', `Allow ${source === 'camera' ? 'the camera' : 'your photos'} in Settings to add a picture.`);
    return undefined;
  }
  const options: ImagePicker.ImagePickerOptions = { mediaTypes: 'images', allowsEditing: true, aspect: [1, 1], quality: 0.6 };
  const result = source === 'camera' ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
  return result.canceled ? undefined : result.assets[0]?.uri;
}
