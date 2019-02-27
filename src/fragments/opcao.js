import React from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import OptionsMenu from "react-native-options-menu";
import { AsyncStorage } from 'react-native';

export default class Opcao {
    constructor(navigation) {
        const opcao = (
            <OptionsMenu
                customButton={(<Icon name='options-vertical' size={20} color='#fff' style={{ marginRight:10 }} />)}
                destructiveIndex={1}
                options={['Logout']}
                actions={[this.logout]}/>
        );

        this.state = {
            navigation: navigation
        }

        return opcao;
    }

    logout = async () => {
        await AsyncStorage.removeItem('usuario', (error) => {
            if(error === null) this.state.navigation.navigate('Login');
            else console.log('Erro: ', error);
        });
    }

    retornarOpcao = () => {
        return this.opcao;
    }
}