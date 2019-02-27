import { createStackNavigator } from 'react-navigation';
import Login from './pages/login';
import ListaAcesso from './pages/lista_acesso';
import DetalheAcesso from './pages/detalhe_acesso';
import CadastrarVisitante from './pages/cadastrar_visitantes'

const options = {
    navigationOptions: {
        headerStyle: {
            backgroundColor: '#06124e'
        },
        headerTintColor: '#FFF'
    }
};

export default createStackNavigator({
    Login,
    ListaAcesso,
    DetalheAcesso,
    CadastrarVisitante
}, options);