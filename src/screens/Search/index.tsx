import React, { useCallback, useEffect, useState } from 'react';
import Header from '../../components/Header';
import { FlatList, Alert, ActivityIndicator, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useForm, useController } from 'react-hook-form';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';

import * as S from './styles';

interface IResult {
  id: string;
  name: string;
  nick: string;
  avatar_url: string;
}

const Input = ({ control }: { control: any }) => {
  const { field } = useController({ control, defaultValue: '', name: 'query' });
  return (
    <S.SearchInput
      value={field.value}
      onChangeText={field.onChange}
      placeholder="Pesquisar"
    />
  );
};

const Search: React.FC = () => {
  const { register, handleSubmit, control, reset } = useForm();
  const [results, setResults] = useState<IResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmitQuery = useCallback(async data => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `/user/search?query=${String(data.query).toLowerCase()}`,
      );
      setResults(response.data);
    } catch (error) {
      Alert.alert('Error', error.response.message);
    }
    setIsLoading(false);
    reset({ query: '' });
    Keyboard.dismiss();
  }, []);

  useEffect(() => {
    register('query');
  }, [register]);

  return (
    <S.Container>
      <Header />
      <S.SearchBar>
        <Input control={control} />
        <S.Button onPress={handleSubmit(handleSubmitQuery)}>
          <Feather name="search" color="#6C0FD9" size={30} />
        </S.Button>
      </S.SearchBar>

      <FlatList
        data={results}
        ListFooterComponent={() => {
          if (!isLoading) return null;
          return (
            <ActivityIndicator
              animating={isLoading}
              style={{ height: 50 }}
              size="large"
              color="#6C0FD9"
            />
          );
        }}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <S.Item
            onPress={() => navigation.navigate('UserScreen', { id: item.id })}
          >
            <S.ItemLeft>
              <S.ItemAvatar source={{ uri: `${item.avatar_url}` }} />
            </S.ItemLeft>
            <S.ItemRight>
              <S.ItemNick>{item.nick}</S.ItemNick>
              <S.ItemName>{item.name}</S.ItemName>
            </S.ItemRight>
          </S.Item>
        )}
      />
    </S.Container>
  );
};

export default Search;
