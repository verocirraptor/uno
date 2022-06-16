const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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");


//var url = "http://127.0.0.1:5000/";
var url = "https://cartasuno.herokuapp.com/";
var urld = "https://cartasuno.herokuapp.com/";

module.exports.enviarEmailConfirmacion = function (direccion, key) {
    
    const msg = {
        to: direccion, // Change to your recipient
        from: "estructura.rio@gmail.com", // Change to your verified sender
        subject: 'Confirmación correo',
        text: 'Haz click para confirmar',
        html: '<p><a href="' + url + 'confirmarUsuario/' + direccion +'/'+ key +'"> Haz clic en este enlace para confirmar tu cuenta</a></p>',
    }

    sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })
}