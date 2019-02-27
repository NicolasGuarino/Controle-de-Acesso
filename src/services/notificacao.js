import { Platform, AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import api from './api';

const Notificacao = (props) => {
    console.log('Iniciando serviço de notificação');

    // Definindo canal de notificação
    const channel = new firebase.notifications.Android.Channel('canal-acesso', 'Canal acesso', firebase.notifications.Android.Importance.Max)
      .setDescription('Canal de notificação de acessos');
    
    // Criando um canal
    firebase.notifications().android.createChannel(channel);

    firebase.messaging().getToken()
        .then(inserir_token);

    appAbertoNotificacao(props);    

    firebase.notifications().onNotification((notification) => {
        
        if(Platform.OS === 'android') {
            notification._android._channelId = channel.channelId;
            notification.android.setSmallIcon('ic_launcher');
        }else{
            notification.ios.setBadge(2);
        }
        
        firebase.notifications().displayNotification(notification);
    });

    firebase.notifications().onNotificationOpened((notification) => {
            const info = notification.notification;
            const acesso = info.data;
               
            props.navigation.navigate('DetalheAcesso', { acesso });
            firebase.notifications().removeDeliveredNotification(info.notificationId)
                .then(() => console.log('Notificacao removida'))
                .catch((error) => console.log(error));
    });
}

appAbertoNotificacao = async (props) => {
    const notificacao = await firebase.notifications().getInitialNotification();

    if(notificacao) {
        const { notification: { notificationId, data } } = notificacao;
        
        props.navigation.navigate('DetalheAcesso', { acesso: data });
        try {
            await firebase.notifications().removeDeliveredNotification(notificationId);
        }catch(error) { 
            console.e(error);
        }
    }
}

inserir_token = async (token) => {
    try {
        const usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
        
        // await api.get(`/validacoes/insereToken/${usuario.usuario_id}/${token}`);
        const resposta = await api.get(`/insere_token.php?usuario_id=${usuario.usuario_id}&token_firebase=${token}`);
        console.log(resposta);
    }catch(error) {
        console.log(error);
    }
}


export default Notificacao;