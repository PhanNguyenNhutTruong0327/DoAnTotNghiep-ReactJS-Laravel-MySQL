import httpAxios from "../httpAxios";

function sendMail(data){
    return httpAxios.post('/send-email',data);
}
function mail_alert_register(data){
    return httpAxios.post('mail_alert_register',data);
}

const mailService = {
    sendMail:sendMail,

    
}
export default mailService;