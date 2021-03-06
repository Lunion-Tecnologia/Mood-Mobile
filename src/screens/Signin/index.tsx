import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import SvgUri from 'expo-svg-uri';
import { useForm } from 'react-hook-form';
import background from '../../assets/background.svg';
import logo from '../../assets/logo.png';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Text, Animated, ActivityIndicator } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-community/async-storage';
import { login } from '../../store/ducks/auth/actions';
import api from '../../services/api';
import * as yup from 'yup';
import * as S from './styles';
import * as Facebook from 'expo-facebook';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

const SignIn: React.FC = () => {
  const containerY = useRef(new Animated.Value(-0.5)).current;
  const [remember, setRemeber] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [secret, setSecret] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { register, handleSubmit, setValue, errors } = useForm({
    resolver: yupResolver(schema),
  });

  Animated.spring(containerY, {
    toValue: 0,
    useNativeDriver: true,
    delay: 500,
  }).start();

  const logIn = async () => {
    try {
      await Facebook.initializeAsync({
        appId: '3002306580091956',
      });
      const { type, token, expirationDate, permissions, declinedPermissions } =
        await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile'],
        });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`,
        );
        Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

  const handleSignIn = useCallback(
    async data => {
      setIsLoading(true);
      try {
        const response = await api.post('/user/signin', data);
        setIsLoading(false);
        api.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${response.data.token}`;

        if (remember === true) {
          await AsyncStorage.setItem('@mood/token', response.data.token);
          await AsyncStorage.setItem(
            '@mood/user',
            JSON.stringify(response.data.user),
          );
        }

        dispatch(login(response.data));
      } catch (error) {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error - Sigin',
          text2: error.response.data.message,
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
          onShow: () => {},
          onHide: () => {},
          onPress: () => {},
        });
      }
    },
    [remember],
  );

  useEffect(() => {
    register('email');
    register('password');
  }, [register]);

  return (
    <S.Container>
      <SvgUri
        fillAll
        style={{ position: 'absolute', opacity: 0.5 }}
        source={background}
      />

      <S.Logo source={logo} />

      <S.BackButton onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={34} color="white" />
      </S.BackButton>

      <S.DataContainer
        style={{
          transform: [
            {
              scale: containerY.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 2],
              }),
            },
          ],
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <S.Title>Login</S.Title>

          <S.InputContainer erros={!errors.email?.message}>
            <S.Input
              onChangeText={text => {
                setValue('email', text);
              }}
              placeholder="E-mail"
              keyboardType="email-address"
            />
          </S.InputContainer>
          {errors.email?.message && <S.Error>{errors?.email?.message}</S.Error>}

          <S.InputContainer erros={!errors.password?.message}>
            <S.Input
              onChangeText={text => {
                setValue('password', text);
              }}
              placeholder="Senha"
              secureTextEntry={secret}
            />
            <S.PasswordEye onPress={() => setSecret(prev => !prev)}>
              <Ionicons
                name={secret ? 'eye-outline' : 'eye-off-outline'}
                size={26}
                color="#ccc"
              />
            </S.PasswordEye>
          </S.InputContainer>
          {errors.password?.message && (
            <S.Error>{errors?.password?.message}</S.Error>
          )}

          <S.SubmitButton onPress={handleSubmit(handleSignIn)}>
            {isLoading ? (
              <ActivityIndicator color="#fff" size="large" />
            ) : (
              <S.SubmitText>Entrar</S.SubmitText>
            )}
          </S.SubmitButton>

          <S.RememberContainer>
            <S.RememberButton onPress={() => setRemeber(prev => !prev)}>
              {remember && <AntDesign name="check" size={18} color="black" />}
            </S.RememberButton>
            <S.RememberText>Lembrar minha senha</S.RememberText>
          </S.RememberContainer>

          <S.ForgotPassButton>
            <S.ForgotPassText>
              Esqueceu a senha?{' '}
              <Text style={{ color: '#6C0FD9' }}>Clique aqui.</Text>
            </S.ForgotPassText>
          </S.ForgotPassButton>
        </ScrollView>
      </S.DataContainer>
    </S.Container>
  );
};

export default SignIn;
