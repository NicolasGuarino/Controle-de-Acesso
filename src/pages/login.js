import React, { Component } from 'React';

import { View, Text, StyleSheet, TextInput, TouchableHighlight, Image, CheckBox, AsyncStorage, AppState, Platform, Switch } from 'react-native';
import api from '../services/api';
import Notificacao from '../services/notificacao';

export default class Login extends Component {
    static navigationOptions = {
        title: 'Portaria'
    }

    constructor() {
        super();

        this.state = {
            email: '',
            senha: '',
            servicoNotificacaoIniciado: false,
            cboMostrarSenha: false,
        };
    }

    async componentWillMount() {
        await AsyncStorage.getItem('usuario', (error, resultado) => {
            if(resultado !== null) this.props.navigation.navigate('ListaAcesso');
            else console.log('Erro: ', error)
        });
        if(Platform.OS === 'android') new Notificacao(this.props)
    }

    verificarLogin = async () => {
        const { email, senha } = this.state;

        try {
            // const resposta = await api.get(`/validacoes/autenticacao/${email}/${senha}`);
            const resposta = await api.get(`/autenticacao.php?usuario=${email}&senha=${senha}`);
    
            const json = resposta.data;
            
            if(json.valor) {
                AsyncStorage.setItem('usuario', JSON.stringify(json), (error) => {
                    if(error === null) this.props.navigation.navigate('ListaAcesso');
                    else console.log('Erro: ', error);
                });
            }else{
                alert("Usuário ou senha inválidos");
            }

        }catch(err){
            alert('Verifique sua conexão com a internet');
        }
    }

    cadastrarVisitante = async () => {
        this.props.navigation.navigate('CadastrarVisitante');
    }  

    render() {
        const chBox = Platform.select({
            ios: 
                (<Switch value={this.state.cboMostrarSenha} onValueChange={() => this.setState({ cboMostrarSenha: !this.state.cboMostrarSenha }) } />),
            android:
                (<CheckBox value={this.state.cboMostrarSenha} onValueChange={() => this.setState({ cboMostrarSenha: !this.state.cboMostrarSenha })} />)
        });

        return (
            <View style={style.mainContainer}>
                <View style={style.logo}>
                    <Image style={{ flex:1 }} source={require('../images/logo_login.png')} />
                </View>

                <View style={style.loginContainer}>
                    <TextInput
                        style={style.input}
                        keyboardType='email-address'
                        placeholder='Digite seu email'
                        onChangeText={(email) => this.setState({ email }) } />

                    <TextInput
                        style={style.input}
                        placeholder='Digite sua senha'
                        secureTextEntry={!this.state.cboMostrarSenha}
                        onChangeText={(senha) => this.setState({ senha })} 
                        value={this.senha} />

                    <View style={style.checkboxContainer}>
                        { chBox }
                        <Text style={style.checkboxContainerText}> Mostrar senha </Text>
                    </View>

                    <TouchableHighlight
                        style={style.loginButton}
                        onPress={this.verificarLogin}>
                            <Text style={style.loginButtonText}> ENTRAR </Text>
                    </TouchableHighlight>


                    <TouchableHighlight
                        style={style.loginButton}
                        onPress={this.cadastrarVisitante}>
                            <Text style={style.loginButtonText}> Cadastrar Visitante</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create({

    mainContainer: {
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff'
    },
    logo: {
        width:124,
        height:99,
        marginTop: 30,
        alignItems:'center',
        justifyContent:'center'
    },
    loginContainer: {
        flex:1,
        minWidth:300,   
        marginTop:15,
    },
    input: {
        height:35,
        borderBottomColor:"#797979",
        borderBottomWidth:0.5,
        marginTop:10,
        marginBottom:10,
    },
    checkboxContainer: {
        flex:1,
        maxWidth:150,
        maxHeight:30,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        marginTop:5,
    },
    loginButton: {
        marginTop:15,
        height:45,
        backgroundColor:'#14A32C',
        alignItems:'center',
        justifyContent:'center'
    },
    loginButtonText: {
        color:'#fff',
        fontSize:16,
        fontWeight:'bold'
    }
});