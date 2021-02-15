import React from 'react';

import * as S from './styles';

import Mood from '../../assets/logo.png';
import {Octicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {useDispatch} from 'react-redux';
import {logout} from '../../store/ducks/auth/actions';
// import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';

const Header: React.FC = () => {

  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(logout());
    delete api.defaults.headers.common['Authorization'];
  }

  return(
    <S.Container>
      <S.Button>
        <Octicons name="gear" size={27} color="#6C0FD9" />
      </S.Button>

      <S.Logo resizeMode="contain" source={Mood} />
      <S.Button onPress={() => handleLogout()}>
        <MaterialCommunityIcons name="logout" size={26} color="#E02041" />
      </S.Button>

    </S.Container>
  )
}

export default Header;
