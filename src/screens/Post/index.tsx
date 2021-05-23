import React, { useEffect, useCallback, useState } from 'react';
import { Alert, ActivityIndicator, Keyboard, ScrollView } from 'react-native';
import * as S from './styles';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import api from '../../services/api';
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useForm } from 'react-hook-form';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import Toast from 'react-native-toast-message';

const CreatePost: React.FC = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue, errors } = useForm();
  const [image, setImage] = useState<ImageInfo>();

  const handlePost = useCallback(
    async data => {
      setIsLoading(true);
      try {
        let formData = new FormData();

        if (image !== undefined) {
          formData.append(
            'image',
            JSON.parse(
              JSON.stringify({
                uri: image.uri,
                type: 'image/jpeg',
                name: 'image.jpeg',
              }),
            ),
          );
        }

        formData.append('content', data.content ?? '');

        const response = await api.post('/post/create', formData, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });

        setIsLoading(false);
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Sucesso',
          text2: 'Seu post foi criado com sucesso!',
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
          onShow: () => {},
          onHide: () => {},
          onPress: () => {},
        });
        Keyboard.dismiss();
        navigation.navigate('Home', { shuldLoad: true });
      } catch (error) {
        Alert.alert('Ocorreu um erro!', error.response.data.message);
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        setIsLoading(false);
      }
    },
    [image],
  );

  const openImagePickerAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result);
    }
  };

  useEffect(() => {
    register('content');
  }, [register]);

  return (
    <S.Container>
      <Header />
      <ScrollView>
        <S.ImageButton onPress={() => openImagePickerAsync()}>
          {image ? (
            <S.Image resizeMode="contain" source={{ uri: image.uri }} />
          ) : (
            <Entypo name="camera" size={50} color="rgba(0,0,0,0.2)" />
          )}
        </S.ImageButton>

        <S.Input
          onChangeText={text => {
            setValue('content', text);
          }}
          multiline
          textAlignVertical="top"
          maxLength={280}
          placeholder="O que está pensando?"
          selectTextOnFocus={true}
        />
        <S.Button disabled={isLoading} onPress={handleSubmit(handlePost)}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#FFF" />
          ) : (
            <S.ButtonText>Publicar</S.ButtonText>
          )}
        </S.Button>
      </ScrollView>
    </S.Container>
  );
};

export default CreatePost;
