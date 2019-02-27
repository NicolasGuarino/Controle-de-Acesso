import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableWithoutFeedback, AsyncStorage, Animated, Dimensions, Keyboard } from 'react-native';
import Opcao from '../fragments/opcao';
import api, { imgUrl, cancelToken } from '../services/api';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

class ItemAcesso extends React.PureComponent {
    render() {
        const liberacao = (this.props.data.liberacao === '0')? '#f5695f' : '#7ab97a';
        
        return (
            <TouchableWithoutFeedback 
                onPress={() => {
                    this.props.navigation.navigate('DetalheAcesso', { acesso: this.props.data });
                }}>
                <View style={style.itemAcesso}>
                    <View style={style.fotoUsuario}>
                        <Image
                            style={{flex:1, borderRadius:0 }}
                            defaultSource={require('../images/ic_defaultUser.png')}
                            source={{uri: imgUrl + '/' + this.props.data.foto_usuario}} />
                    </View>

                    <View style={style.dadosUsuario}>
                        <Text style={style.nomeUsuario}> { this.props.data.usuario } </Text>

                        <View style={style.hr}></View>

                        <Text style={style.empresa}> { this.props.data.empresa } </Text>
                        <Text style={style.empresa}> { this.props.data.tipo_acao } </Text>

                        <Text> {this.props.data.data} - {this.props.data.hora} </Text>
                    </View>

                    <View style={[style.barAcesso, { backgroundColor: liberacao }]}></View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

export default class ListaAcesso extends Component {
    state = {
        jsonData: [],
        isLoading: false,
        empresa_id: 0,
        pagina:1,
        searchBar: {
            width: new Animated.Value(70),
            borderRadius: new Animated.Value(100),
            right: new Animated.Value(10),
            bottom: new Animated.Value(10),
        },
        pesquisar: false,
        filtro: '',
        tipo_usuario: '1,3,4',
        timeout: setTimeout(() => {}, 0),
        emAnimacao: false
    }

    async componentDidMount() {
        await AsyncStorage.getItem('usuario', (error, resultado) => {
            if(resultado !== null) this.setState({ empresa_id: JSON.parse(resultado).empresa_id });
        });
        
        this.listarAcessos(this.state.pagina);
    }

    componentWillMount() {
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
    }
   
    keyboardWillShow(e) {
        const bottom = new Animated.Value(e.endCoordinates.height );
        this.setState({searchBar: { ...this.state.searchBar, bottom }})
    }
   
    keyboardWillHide(e) {
        const bottom = (this.state.pesquisar) ? new Animated.Value(0) : new Animated.Value(10);

        this.setState({searchBar: { ...this.state.searchBar, bottom }})
    }

    listarAcessos = async (pagina) => {
        if(!this.state.isLoading) {
            this.setState({ isLoading: true });
            const { empresa_id, filtro, tipo_usuario } = this.state;
            
            const params = { empresa_id, pagina, filtro, tipo_usuario };

            try {
                const resposta = await api.get(`/listar_pessoas.php`, { params, cancelToken: cancelToken.source().token });
                // const resposta = await api.get(`/registros/${pagina}/`);
                // const resposta = await api.get(`/registros/${empresa_id}/${pagina}/`);
                const jsonData = resposta.data;
                
                this.setState({ jsonData: [ ...this.state.jsonData, ...jsonData ], isLoading: false, pagina });
            }catch(error) {
                this.setState({ isLoading: false })
                alert('Verifique sua conexão com a internet');
            }
        }
    }

    listarMais = () => {
        const pagina = this.state.pagina;
        const numPagina = pagina + 1;

        this.listarAcessos(numPagina);
    }

    nadaEncontrado = () => {
        return(
            <View style={style.containerNadaEncontrado}>
                <Text style={style.containerNadaEncontradoText}> Nenhum item encontrado </Text>
            </View>
        );
    }

    atualizarLista = () => {
        this.setState({ jsonData: [], pagina: 1, tipo_usuario: '1,3,4' }, () => {
            this.listarAcessos(this.state.pagina)
        })
    }

    animacaoBarraPesquisa = () => {
        const { width } = Dimensions.get('window');
        const pesquisar = this.state.pesquisar;
        let rightValue, bottomValue, borderRadiusValue, widthValue;

        if(!this.state.emAnimacao) {
            this.setState({ emAnimacao: true, pesquisar: !pesquisar });
            Keyboard.dismiss();
    
            if(!this.state.pesquisar) {
                rightValue = 0;
                bottomValue = 0;
                borderRadiusValue = 0;
                widthValue = width;
            }else{
                rightValue = 10;
                bottomValue = 10;
                borderRadiusValue = 100;
                widthValue = 70;
            }

            Animated.parallel([
                    Animated.timing(this.state.searchBar.right, { toValue: rightValue, duration: 10 }),
                    Animated.timing(this.state.searchBar.bottom, { toValue: bottomValue, duration: 10 }),
                    Animated.timing(this.state.searchBar.width, { toValue: widthValue, duration: 200 }),
                    Animated.timing(this.state.searchBar.borderRadius, { toValue: borderRadiusValue, duration: 200 })
            ]).start(() => {
                this.setState({ emAnimacao: false });
                // if(!this.state.pesquisar && this.state.filtro !== '') this.pesquisar('');
            });
        }
    }

    pesquisar = (pesquisa) => {
        this.setState({ filtro: pesquisa, jsonData: [], pagina: 1 }, () => {
            cancelToken.source().cancel('Operacao cancelada');

            clearTimeout(this.state.timeout);
            const timeout = setTimeout(() => this.listarAcessos(this.state.pagina), 1000); 

            this.setState({ timeout });
        });
    }

    renderIconesFiltro = (nomeIcone, textoFiltro, valor) => {
        return (
            <TouchableWithoutFeedback 
                onPress={ () => this.preFiltro(valor) }>
                <View style={[ style.icones, { width:(this.state.pesquisar) ? 100 : 0, height:(this.state.pesquisar) ? 100 : 0 } ]}>
                    <FontAwesomeIcon name={nomeIcone} size={22} color={'#fff'} />
                    <Text style={{ color: '#fff', fontWeight:'bold', marginTop:5 }}> { textoFiltro } </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    preFiltro(tipo_usuario) {
        this.animacaoBarraPesquisa();
        this.setState({ tipo_usuario, jsonData: [], pagina: 1 }, () => {
            this.listarAcessos(this.state.pagina);
        });
    }

    render() {
        const txtPesquisarStyle = (this.state.pesquisar) ? 
            { width:'80%', height:45, borderBottomColor: '#fff', borderBottomWidth:1, padding: 10, borderRadius:0, marginRight:15 } :
            { width:0, height:0, borderBottomWidth:0, padding: 0, borderRadius:0, marginRight:0 };
        
        const nomeIcone = (this.state.pesquisar) ?  'close' : 'filter'; 
        
        return(
            <View style={{ flex:1 }}>
                <Image
                    style={{ position:'absolute', height:'100%', width:'100%', flex:1, top:0, left:0 }}
                    source={require('../images/gradiente.png')}/>

                
                <FlatList 
                    data={this.state.jsonData}
                    keyExtractor={item => item.registro_acesso_id }
                    renderItem={({ item }) => <ItemAcesso data={item} navigation={this.props.navigation} />}
                    onEndReached={ this.listarMais }
                    onEndReachedThreshold={ 0.2 }
                    ListEmptyComponent={ this.nadaEncontrado() }
                    onRefresh={ this.atualizarLista }
                    refreshing={ this.state.isLoading }
                    getItemLayout={(data, index) => ({length: 120, offset: 120 * index, index})}
                    removeClippedSubviews={true}/>

                    <Animated.View style={ [ style.barPesquisar, this.state.searchBar ] }>
                        <AntDesignIcon name={nomeIcone} size={38} style={style.iconePesquisar} onPress={ this.animacaoBarraPesquisa }></AntDesignIcon>

                        <View style={ [ style.filtroContainer, (this.state.pesquisar) ? { width: '90%', marginRight: 5 } : null ] }>
                            { this.renderIconesFiltro('users', 'Todos', '1,3,4') }
                            { this.renderIconesFiltro('user-check', 'Funcionários', '1,3') }
                            { this.renderIconesFiltro('user-clock', 'Visitantes', '4') }
                            { this.renderIconesFiltro('user-clock', 'Visitantes', '4') }
                        </View>


                        {/* <TextInput 
                            placeholder='Pesquisar'
                            placeholderTextColor='#fff'
                            value={this.state.filtro}
                            style={[style.txtPesquisar, txtPesquisarStyle]}
                            onChangeText={ this.pesquisar }></TextInput> */}
                    </Animated.View>
            </View>
        );
    }
}

ListaAcesso.navigationOptions = (props) => ({
    title: 'Lista de acesso',
    headerLeft: null,
    headerRight: new Opcao(props.navigation),
});

const style = StyleSheet.create({
    itemAcesso: {
        flex:1,
        width:'95%',
        backgroundColor:'#fff',
        flexDirection: 'row',
        padding:5,
        alignSelf:'center',
        alignItems:'center',
        marginTop:10,
        borderRadius:5,
        overflow:'hidden'
    },
    fotoUsuario: {
        width:80,
        height:80,
        borderRadius:100,
        marginRight:5,
        overflow:'hidden',
    },
    dadosUsuario: {
        minWidth:'60%',
        maxWidth:'65%',
        overflow:'hidden',
    },
    hr: {
        borderTopColor:'#777',
        borderTopWidth:1,
        margin:5,
    },
    nomeUsuario: {
        marginTop:5,
        fontWeight:'bold',
        fontSize:16,
    },
    empresa: {
        marginBottom:10
    },
    containerNadaEncontrado:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        marginTop:20,
    },
    containerNadaEncontradoText: {
        color:'#fff',
        fontSize:18,
        fontWeight:'bold',
    },
    barAcesso: {
        width:30,
        height:'100%',
        borderRadius:2,
    },
    barPesquisar: {
        position:'absolute',
        width:'100%',
        height:70,
        backgroundColor:'#06124e',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.50,
        shadowRadius: 5,
        elevation: 2,
        padding:10,
        borderRadius:0,
        alignItems:'center',
        justifyContent:'center',
        bottom:0,
        right:0,
        flexDirection: 'row-reverse'
    },
    txtPesquisar: {
        fontSize:16,
        color:'#fff',
    },
    iconePesquisar: {
        color:'#fff',
    },
    filtroContainer: {
        flexDirection:'row', 
        justifyContent:'space-between',
        height:'100%',
        flexWrap: 'wrap',
        overflow: 'scroll'
    },
    icones: {
        flexDirection: 'column',
        alignItems: 'center',
    },
});
