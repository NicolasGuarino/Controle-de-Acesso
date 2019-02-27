import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { imgUrl } from '../services/api';
import Opcao from '../fragments/opcao';

const DetalheAcesso = ({ navigation }) => {
    const acesso = navigation.state.params.acesso;
    
    const liberacao = (acesso.liberacao === '0')? '#f5695f' : '#7ab97a';
    const textLiberacao = (acesso.liberacao === '0')? 'FORA DA ESCALA' : 'DENTRO DA ESCALA';

    return (
        <View style={{ flex:1 }}>
            <Image
                style={{ position:'absolute', height:'100%', width:'100%', flex:1, top:0, left:0 }}
                source={require('../images/gradiente.png')}></Image>
            
            <View style={style.container}>    
                <View style={style.imgContainer}>
                    <Image
                        style={{ flex:1 }}
                        defaultSource={require('../images/ic_defaultUser.png')}
                        source={{ uri: imgUrl + '/' + acesso.foto_usuario }}></Image>
                </View>

                <Text style={style.containerText}> { acesso.usuario } </Text>
                <Text style={style.containerSubText}> { acesso.empresa } </Text>
                
                <View style={style.hr} />

                <View style={style.dadosHorizontal}>
                    <Text style={style.dadosSecundarios}> { acesso.tipo_locomocao } </Text>
                    <Text style={style.dadosSecundarios}> { acesso.data } </Text>
                </View>

                <View style={style.dadosHorizontal}>
                    <Text style={style.dadosSecundarios}> { acesso.tipo_acao } </Text>
                    <Text style={style.dadosSecundarios}> { acesso.hora } </Text>
                </View>

                <View style={[ style.acesso, { backgroundColor:liberacao } ]}>
                    <Text style={{ color:'#fff', fontWeight:'bold' }}> { textLiberacao } </Text>
                </View>
            </View>

        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex:1,
        maxHeight:335,
        borderRadius:5,
        flexDirection:'column',
        backgroundColor:'#fff',
        padding:10,
        margin:10,
    },
    imgContainer: {
        width:150,
        height:150,
        borderRadius:100,
        overflow:'hidden',
        alignSelf:'center',
        marginTop:10,
    },
    containerText: {
        fontSize:16,
        marginTop:10,
        alignSelf:'center',
    },
    containerSubText: {
        fontSize:14,
        alignSelf:'center',
    },
    dadosHorizontal: {
        marginTop:5,
        marginBottom:5,
        justifyContent:'space-between',
        flexDirection:'row'
    },
    hr: {
        borderTopColor:'#777',
        borderTopWidth:1,
        margin:5,
    },
    acesso: {
        height:30,
        marginTop:10,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:2,
    }
});

DetalheAcesso.navigationOptions = (props) => ({
    title: 'Detalhes de acesso',
    headerRight: new Opcao(props.navigation)
});

export default DetalheAcesso;