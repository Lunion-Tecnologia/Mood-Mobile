import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {AntDesign, Ionicons, FontAwesome, Entypo, Feather, FontAwesome5} from '@expo/vector-icons';
import PostButton from '../components/PostButton';

const Tab = createBottomTabNavigator();

// Screens

import HomeScreen from '../screens/Home';
import PostScreen from '../screens/Post';
import ProfileScreen from '../screens/Profile';
import SearchScreen from '../screens/Search';
import ConfigScreen from '../screens/Config';

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch(route.name){
              case 'Home':
                return <Entypo name='home' size={size} color={color} />
                break
              case 'Search':
                return <Feather name='search' size={size} color={color} />
                break
              case 'Profile':
                return <FontAwesome5 name='user-alt' size={size} color={color} />
                break
              case 'Config':
                return <FontAwesome name='gear' size={size} color={color} />
                break
              default:
                return <Ionicons name='ios-information-circle' size={size} color={color} />
                break
            }
          },
        })}
        tabBarOptions={{
          style:{
            backgroundColor:'#131418',
            borderTopColor: 'rgba(255,255,255,0.2)',
          },
          activeTintColor:'#FFF',
          inactiveTintColor:'#92929c'
        }}
      >
        <Tab.Screen options={{title:'Home'}} name="Home" component={HomeScreen} />
        <Tab.Screen options={{title:'Procurar'}} name="Search" component={SearchScreen} />
        <Tab.Screen options={{title:'Perfil'}} name="Profile" component={ProfileScreen} />
        <Tab.Screen options={{title:'Configurações'}} name="Config" component={ConfigScreen}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}