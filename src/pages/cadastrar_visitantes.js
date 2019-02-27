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
    CheckBox,
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
            dias: [
                { 'id': '0', 'dia': 'Domingo', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },                
                { 'id': '1', 'dia': 'Segunda-feira', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
                { 'id': '2', 'dia': 'Terça-feira', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
                { 'id': '3', 'dia': 'Quarta-feira', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
                { 'id': '4', 'dia': 'Quinta-feira', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
                { 'id': '5', 'dia': 'Sexta-feira', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
                { 'id': '6', 'dia': 'Sábado', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
            ]
        }
    }

    showSelecionarHorario = (optSelecionado) => {
        this.setState({ visibleHorarioEntrada: true });
        this.setState({ itemClicado: optSelecionado });
    };

    cancelaHorario = () => {
        this.setState({ visibleHorarioEntrada: false });
        this.setState({ visibleHorarioSaida: false });
    };

    confirmaHorario = (horario) => {
        console.log('Horário Selecionado ', horario);
        const totalHorario = horario.toString();
        const replacedHorario = totalHorario.substr(16, 5);

        if(this.state.visibleHorarioEntrada){    
            this.setState({ visibleHorarioEntrada: false, txtHoraEntrada: replacedHorario });
            setTimeout(()=> this.setState({visibleHorarioSaida : true}), 500);
        
        }else{
            this.setState({ visibleHorarioSaida: false, txtHoraSaida: replacedHorario });
            setTimeout(() => this.setState({ dialogVisible: true }), 500);
        
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

    resetHorarios = (value) => {
        Alert.alert("aaa", "aaa aa "+value);
        this.state.dias.map((item) => {
            item.horaEntrada = 'Nenhum';
            item.horaSaida = 'Nenhum';
        });
    }

    onClickListener = (viewId) => {
        Alert.alert("Alert", "Button pressed "+viewId);
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
                    
                    <View style={styles.containerFrequencia}>
                        {
                            this.state.dias.map((dia) => {
                                return (
                                    <TouchableWithoutFeedback onPress={() => this.showSelecionarHorario(dia.id)}>
                                        <View style={styles.frequencia} >
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
                    
                    <TouchableHighlight style={styles.buttonResetEscala} onPress={() => this.resetHorarios('reset')}>
                        <Text style={styles.resetEscalaText}>Limpar escala</Text>
                    </TouchableHighlight>

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
        borderRadius: 10,
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
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
        
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
    
    buttonResetEscala: {
        flex: 1,
        padding: 10,
        marginTop: 10,
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    resetEscalaText: {
        color: '#ff1a1a',
        fontSize:18
    }
});

CadastrarVisitante.navigationOptions = (props) => ({
    title: 'Cadastrar Visitante',
    headerRight: new Opcao(props.navigation)
});

