import { StyleSheet } from 'react-native';

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

    inputIncorrect: {
        borderColor: '#ff0000',
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
        width:"100%",
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:20,
        marginBottom:20,
        borderRadius:5,
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
        marginBottom: 10,
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
        zIndex: 1
        
    },

    methodNaoSelecionado: {
        marginTop: 3,
        height: 33,
        flex: .50,
        backgroundColor: '#bfbfbf',
        paddingTop: 7,
        paddingBottom: 10,
        zIndex: 0
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


export { styles };