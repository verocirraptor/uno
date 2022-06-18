function ClienteRest() {

    this.registrarUsuario = function (email, clave) {
        $.ajax({
            type: 'POST',
            url: '/registrarUsuario',
            data: JSON.stringify({ "email": email, "clave": clave }),
            success: function (data) {
                if (data.email != 'nook') {
                    console.log("Usuario registrado: " + data.email);
                } else {
                    console.log(data)
                    console.log("El usuario no se ha podido registrar.");
                }
            },
            contentType: 'application/json',
            dataType: 'json'
        });
    };

    this.loginUsuario = function (email, clave) {
        $.ajax({
            type: 'POST',
            url: '/loginUsuario',
            data: JSON.stringify({ "email": email, "clave": clave }),
            success: function (data) {
                if (data.nick != "nook") {
                    console.log("Sesión iniciada: " + data.email);
                    ws.nick = data.nick;
                    iu.mostrarHome();
                } else {
                    console.log(data);
                    console.log("Usuario o clave incorrectos.");
                    iu.mostrarModal("Usuario o clave incorrectos.");
                    iu.mostrarInicio();
                }
            },
            contentType: 'application/json',
            dataType: 'json'
        });
    };

    this.agregarJugador = function (nick) {
        $.getJSON("/agregarJugador/" + nick, function (data) {
            console.log(data);
            if (data.nick != -1) {
                ws.nick = data.nick;
                console.log("hola");
                $.cookie("nick", data.nick);
                iu.mostrarHome(data);
            } else {
                iu.mostrarModal("El nick " + nick + " ya está en uso.");
                iu.mostrarAgregarJugador();
            }
        });
    }

    this.eliminarUsuario = function (clave) {
        var nick = $.cookie("nick");
        console.log("Eliminar usuario: ");
        $.ajax({
            type: 'DELETE',
            url: '/eliminarUsuario/'+nick,
            data: { "clave": clave },
            success: function (data) {
                if (data.res == 1) {
                    $.removeCookie("nick");
                    iu.mostrarLogin();
                } else{
                    iu.mostrarModal("No se pudo eliminar el usuario.");
                }
            },
            dataType:'json',
        });
    }

    this.crearPartida = function (nick, num) {
        $.getJSON("/crearPartida/" + nick + "/" + num, function (data) {
            console.log(data);
            ws.codigo = data.codigo;
            iu.mostrarCodigo(data.codigo);
        });
    }

    this.unirAPartida = function (nick, code) {
        $.getJSON("/unirAPartida/" + nick + "/" + code, function (data) {
            console.log(data);
        });
    }

    this.obtenerTodasPartidas = function () {
        $.getJSON("/obtenerTodasPartidas", function (data) {
            iu.mostrarObtenerTodasPartidas(data);
        });
    }

    this.jugarCarta = function (nick, numero) {
        $.getJSON("/jugarCarta/" + nick + "/" + numero, function (data) {
            console.log(data);
        });
    }

    this.robarCarta = function (nick, numero) {
        $.getJSON("/robarCarta/" + nick + "/" + numero, function (data) {
            console.log(data);
        });
    }

    this.abandonarPartida = function (nick) {
        $.getJSON("/abandonarPartida/" + nick, function (data) {
            console.log(data);
        });
    }

    this.cerrarSesion = function () {
        $.getJSON("/cerrarSesion/", function (data) {
            console.log(data);
        });
    }

    this.obtenerTodosResultados = function () {
        $.getJSON("/obtenerTodosResultados", function (data) {
            console.log(data);
            iu.todosResultados(data);
            iu.mostrarVolver();
        });
    }

    this.obtenerResultados = function (nick) {
        $.getJSON("/obtenerResultados/" + nick, function (data) {
            console.log(data);
        });
    }
}