import React, {Component} from 'react'; 
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableHighlight,
    Image,
    Alert,
    Animated,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import Opcao from '../fragments/opcao';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Dialog from 'react-native-dialog';

import Api from '../services/api';
import { TextInputMask } from 'react-native-masked-text'




export default class CadastrarVisitante extends Component {
    constructor(){
        super();

        
        this.state = {
            nome_completo: '',
            rg   : '',
            placa_veiculo: '',
            visibleHorarioEntrada: false,
            visibleHorarioSaida: false,
            dialogVisible: false,
            txtHoraEntrada: 'Nenhum',
            txtHoraSaida: 'Nenhum',
            itemClicado: '',
            dialogConfirmReset: false,
            dias: [
                { 'id': '0', 'dia': 'Domingo', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },                
                { 'id': '1', 'dia': 'Segunda-feira', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
                { 'id': '2', 'dia': 'Terça-feira', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
                { 'id': '3', 'dia': 'Quarta-feira', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
                { 'id': '4', 'dia': 'Quinta-feira', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
                { 'id': '5', 'dia': 'Sexta-feira', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
                { 'id': '6', 'dia': 'Sábado', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
            ],
            isExcecao: true,

            excecoes: [
                // { 'id': '1' , 'data': '28/02/2018', 'horaEntrada': '07:00', 'horaSaida': '17:00'},
            ],
            
            mesesDoAno: [
                {'mesNumerico': '01', 'mes': 'Jan'},
                {'mesNumerico': '02', 'mes': 'Feb'},
                {'mesNumerico': '03', 'mes': 'Mar'},
                {'mesNumerico': '04', 'mes': 'Apr'},
                {'mesNumerico': '05', 'mes': 'May'},
                {'mesNumerico': '06', 'mes': 'Jun'},
                {'mesNumerico': '07', 'mes': 'Jul'},
                {'mesNumerico': '08', 'mes': 'Aug'},
                {'mesNumerico': '09', 'mes': 'Sep'},
                {'mesNumerico': '10', 'mes': 'Oct'},
                {'mesNumerico': '11', 'mes': 'Nov'},
                {'mesNumerico': '12', 'mes': 'Dec'},
                
            ],

            dialogAdicionarExcecao: false,
            dialogHorarioEntradaExcecao: false,
            dialogHorarioSaidaExcecao: false,
            dialogConfirmaExcecao: false

        }
    }

    componentDidMount(){
        
    }

    showSelecionarHorario = (optSelecionado) => {
        this.setState({ visibleHorarioEntrada: true });
        this.setState({ itemClicado: optSelecionado });
    };

    cancelaHorario = () => {
        this.setState({ visibleHorarioEntrada: false });
        this.setState({ visibleHorarioSaida: false });
        
        this.setState({ dialogAdicionarExcecao: false });
        this.setState({ dialogHorarioEntradaExcecao: false });
        this.setState({ dialogHorarioSaidaExcecao: false });
    };

    confirmaHorario = (horario) => {
        console.log('Horário Selecionado ', horario);
        const totalHorario = horario.toString();
        const replacedHorario = totalHorario.substr(16, 5);

        if(this.state.visibleHorarioEntrada){    
            this.setState({ visibleHorarioEntrada: false, txtHoraEntrada: replacedHorario });
            setTimeout(()=> this.setState({visibleHorarioSaida : true}), 500);
        
        }else{
            if(this.state.dialogHorarioEntradaExcecao){
                this.setState({dialogHorarioEntradaExcecao: false,  txtHoraEntrada : replacedHorario});
                setTimeout(() => this.setState({ dialogHorarioSaidaExcecao: true }), 500);

            }else if(this.state.dialogHorarioSaidaExcecao){
                this.setState({dialogHorarioSaidaExcecao: false, txtHoraSaida : replacedHorario});
                setTimeout(() => this.setState({ dialogConfirmaExcecao: true }), 500);

            }else{
                this.setState({ visibleHorarioSaida: false, txtHoraSaida: replacedHorario });
                setTimeout(() => this.setState({ dialogVisible: true }), 500);

            }
            
        
        }
    };

    naoAplicarTodos = () => {
        console.log('Nao aplicar a todos');
        
        let id = this.state.itemClicado;
        let tempArray = [...this.state.dias];
        tempArray[id].horaEntrada = this.state.txtHoraEntrada;
        tempArray[id].horaSaida = this.state.txtHoraSaida;
        this.setState({dias: tempArray});

        this.setState({ dialogVisible: false });
    };
    
    aplicarTodos = () => {
        this.state.dias.map((item) => {
            item.horaEntrada = this.state.txtHoraEntrada;
            item.horaSaida = this.state.txtHoraSaida;
        });

        this.setState({ dialogVisible: false });
    }

    resetHorarios = () => {

        const tempArray = this.state.dias;

        tempArray.map((item) => {
            item.horaEntrada = 'Nenhum';
            item.horaSaida = 'Nenhum';
        });
        this.setState({ dias: tempArray, dialogConfirmReset: false });

    }

    onClickListener = (viewId) => {
        Alert.alert("Alert", "Button pressed "+viewId);
    }

    setLayExcecao = () => {
        this.setState({ isExcecao: true });
    }

    setLayEscala = () => {
        this.setState({ isExcecao: false });
    }

   
    layoutEscala = () => {
        return (
            <View>
                <View style={[styles.containerFrequencia, styles.radiusWithoutTopRight]}>
                    {
                        this.state.dias.map((dia) => {
                            return (
                                <TouchableWithoutFeedback onPress={() => this.showSelecionarHorario(dia.id)}>
                                    <View style={[styles.frequencia, styles.borderBottomGray]} >
                                        <Text style={styles.textDiaFrequencia}>{dia.dia}</Text>
                                        <Text style={styles.textHoraFrequencia}>{dia.horaEntrada == 'Nenhum' ? dia.horaEntrada : 'Das ' + dia.horaEntrada + ' às ' + dia.horaSaida}</Text>
                                        <View style={styles.setaFrequencia}>
                                            <Image source={require('../images/icon-seta2.png')}/>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                    
                </View>

                <TouchableHighlight style={styles.buttonResetEscala} onPress={() => this.setState({ dialogConfirmReset: true })}>
                    <Text style={styles.resetEscalaText}>Limpar escala</Text>
                </TouchableHighlight>
            </View> 
        )
    }

    confirmaData = (data) => {
        console.log("Data Selecionada " + data);
        var dataCompleta = data.toString();

        var dia = dataCompleta.substr(8, 2);
        var mesBuscado = dataCompleta.substr(4, 3);
        var ano = dataCompleta.substr(11, 4);
        console.log(ano);

        var mesCorreto = this.state.mesesDoAno.find(mes => { return mes.mes === mesBuscado });

        mesBuscado = mesCorreto.mesNumerico.toString()
        dataCompleta = dia + '/' + mesBuscado + '/' + ano;

        console.log(dataCompleta);
        this.setState({ txtDataExcecao : dataCompleta, dialogAdicionarExcecao : false});
        setTimeout(() => this.setState({ dialogHorarioEntradaExcecao: true }), 500);
    }

    adicionarExcecao = () => {
        const id = this.state.excecoes.length + 1;
        const data = this.state.txtDataExcecao;
        const horaEntrada = this.state.txtHoraEntrada;
        const horaSaida = this.state.txtHoraEntrada;

        const novoObj = {'id':id, 'data': data, 'horaEntrada': horaEntrada, 'horaSaida': horaSaida};
        const novaArray = this.state.excecoes.slice(); // Criando uma cópia
        novaArray.push(novoObj); // Inserindo o objeto
        this.setState({ excecoes: novaArray, dialogConfirmaExcecao: false });
    }

    layoutExcecao = () => {
        return (
            <View>
                <View style={[styles.containerEscala, styles.radiusWithoutTopLeft]}>
                    {
                        this.state.excecoes.map((excecao) => {
                            return (
                                <View style={[styles.frequencia, styles.borderBottomGray]} >
                                    <Text style={styles.textDiaFrequencia}>{excecao.data}</Text>
                                    <Text style={styles.textHoraFrequencia}>{excecao.horaEntrada == '' ? excecao.horaEntrada : 'Das ' + excecao.horaEntrada + ' às ' + excecao.horaSaida}</Text>
                                    <View style={styles.setaFrequencia}>
                                        <Image source={require('../images/icon-seta2.png')}/>
                                    </View>
                                </View>
                            )
                        })
                    }
                    <TouchableWithoutFeedback onPress={() => this.setState({ dialogAdicionarExcecao : true })}>
                        <View style={styles.frequencia}>
                            <Text style={this.state.excecoes.length > 0 ? styles.textExcecao : [styles.textSemExcecao ]}> 
                            {
                                this.state.excecoes.length > 0 ? 'Adicionar outra exceção' : 'Clique aqui para \n Adicionar uma exceção'
                            } 
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                <DateTimePicker
                    isVisible={this.state.dialogAdicionarExcecao}
                    onConfirm={this.confirmaData}
                    onCancel={this.cancelaHorario}
                    mode={'date'}
                    titleIOS={'Selecione o dia da Escala'}
                />

                <DateTimePicker
                    isVisible={this.state.dialogHorarioEntradaExcecao}
                    onConfirm={this.confirmaHorario}
                    onCancel={this.cancelaHorario}
                    mode={'time'}
                    titleIOS={'Horário de Entrada'}
                />

                <DateTimePicker
                    isVisible={this.state.dialogHorarioSaidaExcecao}
                    onConfirm={this.confirmaHorario}
                    onCancel={this.cancelaHorario}
                    mode={'time'}
                    titleIOS={'Horário de Saída'}
                />

                <View>
                    <Dialog.Container visible={this.state.dialogConfirmaExcecao}>
                        <Dialog.Title>Horário selecionado: {"\n"} Das {this.state.txtHoraEntrada} às {this.state.txtHoraSaida}</Dialog.Title>
                        <Dialog.Description>Deseja aplicar esta exceção?</Dialog.Description>

                        <Dialog.Button label="Cancelar" onPress={() => this.setState({ dialogConfirmaExcecao: false })} />
                        <Dialog.Button label="Confirmar" onPress={this.adicionarExcecao} />
                    </Dialog.Container>
                </View>
            </View>
        )
    }

    render(){
        return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <View style={styles.inputContainer}>
                        <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/male-user/ultraviolet/50/3498db'}}/>
                        <TextInput style={styles.inputs}
                            placeholder="Nome Completo"
                            underlineColorAndroid='transparent'
                            onChangeText={(nome_completo) => this.setState({nome_completo})}/>
                    </View>

                    <View style={styles.inputContainer}>
                        <Image style={styles.inputIcon} source={require('../images/icon-rg.png')}/>
                        <TextInput style={styles.inputs}
                            placeholder="RG"
                            underlineColorAndroid='transparent'
                            onChangeText={(rg) => this.setState({rg})}/>
                    </View>
                    
                    <View style={styles.inputContainer}>
                        <Image style={styles.inputIcon} source={require('../images/icon-placa.png')}/>
                        <TextInput style={styles.inputs}
                            placeholder="Placa do veículo (se existir)"
                            underlineColorAndroid='transparent'
                            onChangeText={(placa_veiculo) => this.setState({placa_veiculo})}/>
                    </View>

                    <Text style={styles.escalaText}>Selecione a frequência</Text>

                    <View style={styles.viewSelectMethod}>
                        <TouchableWithoutFeedback onPress={() => this.setLayExcecao()}>
                            <View style={this.state.isExcecao ? styles.methodSelecionado : [styles.methodNaoSelecionado, styles.radiusLeft]} >
                                <Text style={this.state.isExcecao ? styles.textoHabilitado : styles.textoNaoHabilitado}> Exceção </Text> 
                            </View>
                        </TouchableWithoutFeedback>
                        
                        <TouchableWithoutFeedback onPress={() => this.setLayEscala()}>
                            <View style={!this.state.isExcecao ? styles.methodSelecionado : [styles.methodNaoSelecionado, styles.radiusRight]}>
                                <Text style={!this.state.isExcecao ? styles.textoHabilitado : styles.textoNaoHabilitado}> Escala </Text> 
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                    {!this.state.isExcecao ? this.layoutEscala()  : this.layoutExcecao()}
                    
                        
                    <DateTimePicker
                        isVisible={this.state.visibleHorarioEntrada}
                        onConfirm={this.confirmaHorario}
                        onCancel={this.cancelaHorario}
                        mode={'time'}
                        titleIOS={'Horário de Entrada'}
                    />

                    <DateTimePicker
                        isVisible={this.state.visibleHorarioSaida}
                        onConfirm={this.confirmaHorario}
                        onCancel={this.cancelaHorario}
                        mode={'time'}
                        titleIOS={'Horário de Saída'}
                    />
                    
                    

                    <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]} onPress={() => this.onClickListener('sign_up')}>
                        <Text style={styles.signUpText}>Cadastrar Visitante</Text>
                    </TouchableHighlight>

                    <View>
                        <Dialog.Container visible={this.state.dialogVisible}>
                        <Dialog.Title>Horário selecionado: {"\n"} Das {this.state.txtHoraEntrada} às {this.state.txtHoraSaida}</Dialog.Title>
                        <Dialog.Description> 
                            Deseja aplicar este horário para todos os outros dias?
                        </Dialog.Description>
                        <Dialog.Button label="Não aplicar" onPress={this.naoAplicarTodos}/>
                        <Dialog.Button label="Aplicar" onPress={this.aplicarTodos}/>
                        </Dialog.Container>
                    </View>

                    <View>
                        <Dialog.Container visible={this.state.dialogConfirmReset}>
                            <Dialog.Title>Confirmar</Dialog.Title>
                            <Dialog.Description>Deseja realmente limpar todos os horários?</Dialog.Description>

                            <Dialog.Button label="Cancelar" onPress={() => this.setState({ dialogConfirmReset: false })} />
                            <Dialog.Button label="Confirmar" onPress={this.resetHorarios} />
                        </Dialog.Container>
                    </View>
                </View>
            </ScrollView>
        );
    }   
    
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#06124e',
        paddingBottom: 45,
    },
    container: {
        flex: 1,
        paddingTop: 45, 
        paddingLeft:20,
        paddingRight:20,
        backgroundColor: '#06124e',
    },
    containerFrequencia: {
        backgroundColor: "#fff",
    },
    
    containerEscala: {
        backgroundColor: "#fff",
        height: 300,
    },

    inputContainer: {
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderRadius:30,
        borderWidth: 1,
        width:"100%",
        height:45,
        marginBottom:20,
        flexDirection: 'row',
        alignItems:'center'
    },
    inputs:{
        height:45,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    inputIcon:{
        width:30,
        height:30,
        marginLeft:15,
        justifyContent: 'center'
    },
    buttonContainer: {
        width:"80%",
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:20,
        marginBottom:20,
        borderRadius:1,
        marginLeft:"10%",
        borderWidth: 1,
        borderColor: "#06124e"
    
    },
    signupButton: {
        backgroundColor: "#fff",
    },
    signUpText: {
        color: '#06124e',
        fontSize:18,
        fontWeight:'bold'
    },
    escalaText:{
        color:"#fff",
        fontSize:20,
        fontWeight:'bold',
        marginLeft:"19%",
        marginBottom:25
    },
    frequencia: {
        flexDirection: 'row',
        paddingTop: 15,
        paddingLeft: 15,
        paddingBottom: 10,
        width: '100%',
        
    },

    borderBottomGray: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },

    textDiaFrequencia:{
        color: '#737373',
        flex: .35,
        flexDirection: 'row',
        textAlign: 'left',
        justifyContent: 'flex-start',
    },
    textHoraFrequencia: {
        color: '#737373',
        flex: .45,
        flexDirection: 'row',
        textAlign: 'right',
        justifyContent: 'flex-end'
    },
    setaFrequencia: {
        flex: .2,
        flexDirection: 'row',
        textAlign: 'right',
        justifyContent: 'flex-end',
        marginRight: 15
    },

    textExcecao:{
        color: '#737373',
        flex: 1,
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
    },

    textSemExcecao: {
        color: '#737373',
        flex: 1,
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        fontSize: 24,
        marginTop: 100
    },
    
    buttonResetEscala: {
        flex: 1,
        padding: 10,
        marginTop: 10,
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    resetEscalaText: {
        color: '#ff1a1a',
        fontSize:18
    },

    viewSelectMethod: {
        flex: 1,
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        height: 40,
    },

    methodSelecionado: {
        height: 40,
        flex: .50,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        
    },

    methodNaoSelecionado: {
        marginTop: 3,
        height: 33,
        flex: .50,
        backgroundColor: '#bfbfbf',
        paddingTop: 7,
        paddingBottom: 10,
        
    },

    textoHabilitado: {
        textAlign: 'center',
        color: '#262626',
        fontSize: 18,
    },

    textoNaoHabilitado: {
        textAlign: 'center',
        color: '#737373',
        fontSize: 16,
    },

    radiusRight: {
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
    },

    radiusLeft: {
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
    },

    radiusWithoutTopLeft: {
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5
    },

    radiusWithoutTopRight: {
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopLeftRadius: 5
    }
});

CadastrarVisitante.navigationOptions = (props) => ({
    title: 'Cadastrar Visitante',
    headerRight: new Opcao(props.navigation)
});

