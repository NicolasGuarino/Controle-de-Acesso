import React, {Component} from 'react'; 
import {
    Text,
    View,
    TextInput,
    TouchableHighlight,
    Image,
    Animated,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';

import Opcao from '../fragments/opcao';

import DateTimePicker from 'react-native-modal-datetime-picker';
import Dialog from 'react-native-dialog';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';


import { styles } from '../styles/stylesCadastrarVisitante';

import Api from '../services/api';
import { TextInputMask } from 'react-native-masked-text'
import api from '../services/api';




export default class CadastrarVisitante extends Component {
    constructor(){
        super();

        
        this.state = {
            nome_completo: '',
            rg   : '',
            placa_veiculo: '',
            txtHoraEntrada: 'Nenhum',
            txtHoraSaida: 'Nenhum',
            txtDataExcecao: '',
            itemClicado: '',

            dias: [
                { 'id': '0', 'dia': 'Domingo', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },                
                { 'id': '1', 'dia': 'Segunda-feira', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
                { 'id': '2', 'dia': 'Terça-feira', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
                { 'id': '3', 'dia': 'Quarta-feira', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
                { 'id': '4', 'dia': 'Quinta-feira', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
                { 'id': '5', 'dia': 'Sexta-feira', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
                { 'id': '6', 'dia': 'Sábado', 'horaEntrada': 'Nenhum', 'horaSaida': 'Nenhum' },
            ],
            excecoes: [],
            mesesDoAno: [
                {'id': '1', 'mesNumerico': '01', 'mes': 'Jan'},
                {'id': '2', 'mesNumerico': '02', 'mes': 'Feb'},
                {'id': '3', 'mesNumerico': '03', 'mes': 'Mar'},
                {'id': '4', 'mesNumerico': '04', 'mes': 'Apr'},
                {'id': '5', 'mesNumerico': '05', 'mes': 'May'},
                {'id': '6', 'mesNumerico': '06', 'mes': 'Jun'},
                {'id': '7', 'mesNumerico': '07', 'mes': 'Jul'},
                {'id': '8', 'mesNumerico': '08', 'mes': 'Aug'},
                {'id': '9', 'mesNumerico': '09', 'mes': 'Sep'},
                {'id': '10', 'mesNumerico': '10', 'mes': 'Oct'},
                {'id': '11', 'mesNumerico': '11', 'mes': 'Nov'},
                {'id': '12', 'mesNumerico': '12', 'mes': 'Dec'},
                
            ],

            isExcecao: true,
            visibleHorarioEntrada: false,
            visibleHorarioSaida: false,
            dialogVisible: false,
            dialogConfirmReset: false,
            dialogAdicionarExcecao: false,
            dialogHorarioEntradaExcecao: false,
            dialogHorarioSaidaExcecao: false,
            dialogConfirmaExcecao: false,


        }
    }

    showSelecionarHorario = (optSelecionado) => {
        this.setState({ visibleHorarioEntrada: true, itemClicado: optSelecionado });
    };

    cancelaHorario = () => {
        this.setState({ visibleHorarioEntrada: false, visibleHorarioSaida: false });
        this.setState({ dialogAdicionarExcecao: false, dialogHorarioEntradaExcecao: false, dialogHorarioSaidaExcecao: false });
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

    
   
    layoutEscala = () => {
        return (
            <View>
                <View style={[styles.containerFrequencia, styles.radiusWithoutTopRight]}>
                    {
                        this.state.dias.map((dia) => {
                            return (
                                <TouchableWithoutFeedback onPress={dia.horaEntrada == 'Nenhum' ? () => this.showSelecionarHorario(dia.id) : () => this.removeEscala(dia.id)}>
                                    <View style={[styles.frequencia, styles.borderBottomGray]} >
                                        <Text style={styles.textDiaFrequencia}>{dia.dia}</Text>
                                        <Text style={styles.textHoraFrequencia}>{dia.horaEntrada == 'Nenhum' ? dia.horaEntrada : 'Das ' + dia.horaEntrada + ' às ' + dia.horaSaida}</Text>
                                        <View style={styles.setaFrequencia}>
                                            <Image source={dia.horaEntrada == 'Nenhum' ? require('../images/icon-seta2.png') : require('../images/icon-delete.png')}/>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        })
                    }

                    <TouchableHighlight style={styles.buttonResetEscala} onPress={() => this.setState({ dialogConfirmReset: true })}>
                        <Text style={styles.resetEscalaText}>Limpar escala</Text>
                    </TouchableHighlight>
                </View>

                
            </View> 
        )
    }

    removeEscala = (escalaId) => {
        let tempArray = [...this.state.dias];
        tempArray[escalaId].horaEntrada = 'Nenhum';
        tempArray[escalaId].horaSaida = 'Nenhum';
        this.setState({dias: tempArray});

        this.setState({ dialogVisible: false });
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

    removerExcecao = (excecao) => {
        var tempExcecoes = [...this.state.excecoes];
        var indexExcecao = tempExcecoes.indexOf(excecao);

        if(indexExcecao != -1){
            tempExcecoes.splice(indexExcecao, 1);
            this.setState({ excecoes: tempExcecoes });
        }
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
                                    <TouchableWithoutFeedback onPress={() => this.removerExcecao(excecao)}>
                                        <View style={styles.setaFrequencia}>
                                            <Image source={require('../images/icon-delete2.png')}/>
                                        </View>
                                    </TouchableWithoutFeedback>
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
                        <Dialog.Title>Exceção selecionada:{"\n"} {this.state.txtDataExcecao} {"\n"} Das {this.state.txtHoraEntrada} às {this.state.txtHoraSaida}</Dialog.Title>
                        <Dialog.Description>Deseja aplicar esta exceção?</Dialog.Description>

                        <Dialog.Button label="Cancelar" onPress={() => this.setState({ dialogConfirmaExcecao: false })} />
                        <Dialog.Button label="Confirmar" onPress={this.adicionarExcecao} />
                    </Dialog.Container>
                </View>
            </View>
        )
    }

    finalizarCadastro = async () => {
        if(this.state.nome_completo == '') this.setState({ preencherNome : true });
        if(this.state.rg == '') this.setState({ preencherRg : true });

        // try { 
        //     await fetch(api + "/inserirVisitante.php", {
        //         method: 'POST',
        //         headers: {
        //           Accept: 'application/json',
        //           'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //           nome: this.state.nome_completo,
        //           rg: this.state.rg,
        //           placa: this.state.placa_veiculo,
        //           lstExcecoes: this.state.excecoes,
        //           lstEscala: this.state.dias
        //         }),
        //     })
        //     .then((resultado) => resultado.json())
        //     .then((resultadoJson) => {
        //         console.log(resultadoJson);
        //         Alert("Teste", "Cheguei Aqui");
        //     }).catch((error) => {
        //         console.log(error);
        //     });

        // } catch (error) {
        //    alert("Erro de conexão","Verifique sua conexão com a internet e tente novamente!");
        // }

    }

    render(){

        return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <View style={!this.state.preencherNome ?  styles.inputContainer : styles.inputIncorrect}>
                        <Image style={styles.inputIcon} source={!this.state.preencherNome ? require('../images/maleOk.png') : require('../images/maleError.png')}/>
                        <TextInput style={styles.inputs}
                            placeholder="Nome Completo"
                            underlineColorAndroid='transparent'
                            onChangeText={(nome_completo) => this.setState({nome_completo})}
                            onFocus={() => this.setState({ preencherNome: false })}/>
                    </View>

                    <View style={!this.state.preencherRg ?  styles.inputContainer : styles.inputIncorrect}>
                        <Image style={styles.inputIcon} source={!this.state.preencherRg ? require('../images/icon-rg.png') : require('../images/icon-rgError.png')}/>
                        <TextInput style={styles.inputs}
                            placeholder="RG"
                            underlineColorAndroid='transparent'
                            onChangeText={(rg) => this.setState({rg})}
                            onFocus={() => this.setState({ preencherRg: false })}/>
                    </View>
                    
                    <View style={styles.inputContainer}>
                        <Image style={styles.inputIcon} source={require('../images/icon-placa.png')}/>
                        <TextInput style={styles.inputs}
                            placeholder="Placa do veículo (se existir)"
                            underlineColorAndroid='transparent'
                            onChangeText={(placa_veiculo) => this.setState({placa_veiculo})}/>
                    </View>

                    <Text style={styles.escalaText}>Selecione a frequência</Text>

                    <View>
                        <View style={styles.viewSelectMethod}>
                            <TouchableWithoutFeedback onPress={() => this.setState({ isExcecao: true })}>
                                <View style={this.state.isExcecao ? styles.methodSelecionado : [styles.methodNaoSelecionado, styles.radiusLeft]} >
                                    <Text style={this.state.isExcecao ? styles.textoHabilitado : styles.textoNaoHabilitado}> Exceção </Text> 
                                </View>
                            </TouchableWithoutFeedback>
                            
                            <TouchableWithoutFeedback onPress={() => this.setState({ isExcecao: false })}>
                                <View style={!this.state.isExcecao ? styles.methodSelecionado : [styles.methodNaoSelecionado, styles.radiusRight]}>
                                    <Text style={!this.state.isExcecao ? styles.textoHabilitado : styles.textoNaoHabilitado}> Escala </Text> 
                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                        {!this.state.isExcecao ? this.layoutEscala()  : this.layoutExcecao()}
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

                    <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]} onPress={() => this.finalizarCadastro()}>
                        <Text style={styles.signUpText}>Cadastrar Visitante</Text>
                    </TouchableHighlight>

                </View>
            </ScrollView>
        );
    }   
    
}



CadastrarVisitante.navigationOptions = (props) => ({
    title: 'Cadastrar Visitante',
    headerRight: new Opcao(props.navigation)
});

