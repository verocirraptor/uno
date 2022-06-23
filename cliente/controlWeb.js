function ControlWeb() {

    this.nick;

    this.comprobarUsuario = function () {
        if ($.cookie("nick")) {
            ws.nick = $.cookie("nick");
            iu.mostrarHome({ nick: ws.nick });
        } else {
            iu.mostrarInicio();
        }
    }

    this.limpiar = function () {
        $("#mAlertaRoja").remove();
        $("#mAlertaAzul").remove();
        $("#mAlertaVerde").remove();
        $("#mTR").remove();
        $("#tR").remove();
        $("#mV").remove();
        $("#mLU").remove();
        $("#mRU").remove();
        $("#lU").remove();
        $("#rU").remove();
        $("#mLUG").remove();
        $("#mOTP").remove();
        $("#mN").remove();
        $("#mSalir").remove();
        $("#mCP").remove();
        $("#mEsp").remove();
        $("#mC").remove();
        $("#mS").remove();
        $("#mT").remove();
        $("#mUC").remove();
        $("#mUAP").remove();
        $("#mMano").remove();
        $("#mCA").remove();
        $("#mRC").remove();
        $("#mPT").remove();
        $("#mM").remove();
        $("#mAP").remove();
    }

    this.mostrarInicio = function () {
        iu.mostrarTodosResultados();
        iu.mostrarRegistrarUsuario();
        iu.loginUsuario();
        iu.loginUsuarioGoogle();
    }

    this.mostrarHome = function () {
        rest.obtenerTodasPartidas();
        iu.mostrarSalirUsuario();
        iu.mostrarNick(ws.nick);
        iu.mostrarCrearPartida();
        iu.mostrarUnirAPartida();
    }

    this.mostrarFaseEsperando = function (data) {
        iu.mostrarNick(data.nick);
        iu.mostrarCodigo(data.codigo);
        iu.mostrarSalirUsuario();
        iu.mostrarEsperando();
    }

    this.mostrarJugando = function (data) {
        iu.mostrarNick(data.nick);
        iu.mostrarCodigo(data.codigo);
        iu.mostrarSuerte();
        iu.mostrarPasarTurno();
        iu.mostrarRobarCarta();
        iu.mostrarAbandonarPartida();
    }

    this.loginUsuarioGoogle = function () {
        var cadena = '<div id="mLUG"><p>Inicia sesión con google:</p>';
        cadena = cadena + '<a href="/auth/google" class="btn btn-primary">Acceder a google</a>';
        cadena = cadena + '</div>';

        //ahora toca dibujarlo con jquery; usa la almohadilla de selector
        $("#loginUsuarioGoogle").append(cadena);
    }

    this.loginUsuario = function () {
        var cadena = '<div id="lU"><label for="usr"><h5></h5>Iniciar sesión:</label>';
        cadena = cadena + '<form action="/action_page.php" class="was-validated">';
        cadena = cadena + '<div class="form-group">';
        cadena = cadena + '<input type="text" class="form-control" id="correo" placeholder="correo electrónico" name="uname" required>';
        cadena = cadena + '<div class="valid-feedback">✓</div>';
        cadena = cadena + '<div class="invalid-feedback">Rellene este campo.</div>';
        cadena = cadena + '</div>';
        cadena = cadena + '<div class="form-group">';
        cadena = cadena + '<input type="password" class="form-control" id="clave" placeholder="contraseña" name="pswd" required>';
        cadena = cadena + '<div class="valid-feedback">✓</div>';
        cadena = cadena + '<div class="invalid-feedback">Rellene este campo.</div>';
        cadena = cadena + '</div>';
        cadena = cadena + '<button type="submit" id="btnLU" class="btn btn-primary">Entrar</button>';
        cadena = cadena + '</form></div>';

        $("#loginUsuario").append(cadena);

        $("#btnLU").on("click", function () {
            correo = $('#correo').val();
            clave = $('#clave').val();
            if ((correo == "") || (clave == "")) {
                iu.mostrarAlertaRoja("Introduce un correo electrónico y contraseña válidos.");
            }
            else {
                iu.limpiar();
                rest.loginUsuario(correo, clave);
            }
        });
    }

    this.registrarUsuario = function () {
        var cadena = '<div id="rU"><label for="usr"><h5></h5>Nuevo usuario:</label>';
        cadena = cadena + '<form action="/action_page.php" class="was-validated">';
        cadena = cadena + '<div class="form-group">';
        cadena = cadena + '<input type="text" class="form-control" id="correo" placeholder="correo electrónico" name="uname" required>';
        cadena = cadena + '<div class="valid-feedback">✓</div>';
        cadena = cadena + '<div class="invalid-feedback">Rellene este campo.</div>';
        cadena = cadena + '</div>';
        cadena = cadena + '<div class="form-group">';
        cadena = cadena + '<input type="password" class="form-control" id="contraseña" placeholder="contraseña" name="pswd" required>';
        cadena = cadena + '<div class="valid-feedback">✓</div>';
        cadena = cadena + '<div class="invalid-feedback">Rellene este campo.</div>';
        cadena = cadena + '</div>';
        cadena = cadena + '<div class="form-group form-check">';
        cadena = cadena + '<label class="form-check-label">';
        cadena = cadena + '<input class="form-check-input" type="checkbox" name="remember" required> Acepto los términos.';
        cadena = cadena + '<div class="valid-feedback">✓</div>';
        cadena = cadena + '<div class="invalid-feedback">Acepta antes de continuar.</div>';
        cadena = cadena + '</label>';
        cadena = cadena + '</div>';
        cadena = cadena + '<button type="submit" id="btnRU" class="btn btn-primary">Crear</button>';
        cadena = cadena + '</form></div>';

        $("#registrarUsuario").append(cadena);

        $("#btnRU").on("click", function () {
            correo = $('#correo').val();
            clave = $('#contraseña').val();
            if ((correo == "") || (clave == "")) {
                iu.mostrarAlertaRoja("Introduce un correo electrónico y contraseña válidos.");
            }
            else {
                iu.limpiar();
                rest.registrarUsuario(correo, clave);
                iu.mostrarInicio();
            }
        });
    }

    this.mostrarRegistrarUsuario = function () {
        var cadena = '<div id="mRU"><p>¿Eres nuevo?</p><button type="button" id="btnRU" class="btn btn-danger">Registrarme</button></div>';

        $("#mostrarRegistrarUsuario").append(cadena);

        $("#btnRU").on("click", function () {
            $("#lU").remove();
            $("#mRU").remove();
            iu.registrarUsuario();
            iu.mostrarLoginUsuario();
        });
    };

    this.mostrarLoginUsuario = function () {
        var cadena = '<div id="mLU"><p>¿Ya tienes cuenta?</p><button type="button" id="btnLU" class="btn btn-danger">Iniciar sesión</button></div>';

        $("#mostrarLoginUsuario").append(cadena);

        $("#btnLU").on("click", function () {
            $("#rU").remove();
            $("#mLU").remove();
            iu.loginUsuario();
            iu.mostrarRegistrarUsuario();
        });
    };

    this.todosResultados = function (lista) {
        var cadena = '<div id="tR" class="list-group">';
        for (i = 0; i < Object.keys(lista).length; i++) {
            cadena = cadena + '<li class="list-group-item"><span style="font-weight:bold">Propietario: </span>'
                + lista[i].propietario + ' <span style="font-weight:bold">Ganador: </span>'
                + lista[i].ganador + '<span style="font-weight:bold"> Puntos: </span>'
                + lista[i].puntos + '</li>';
        }
        cadena = cadena + '</div>';

        $("#todosResultados").append(cadena);
    };

    this.mostrarTodosResultados = function () {
        var cadena = '<div class="container text-center" id="mTR">';
        cadena = cadena + '<p>¡Resultados de tus últimas partidas!</p>';
        cadena = cadena + '<button type="button" id="btnTR" class="btn btn-outline-info">consultar resultados</button>'
        cadena = cadena + '<h6><br></h6></div>';

        $("#mostrarTodosResultados").append(cadena);

        $("#btnTR").on("click", function () {
            iu.limpiar();
            rest.obtenerTodosResultados();
        });
    };

    this.mostrarVolver = function () {
        var cadena = '<div id="mV">';
        cadena = cadena + '<p>¿Juegas?</p>';
        cadena = cadena + '<button type="button" id="btnV" class="btn btn-outline-info">Volver a inicio</button><br/></div>';

        $("#volver").append(cadena);

        $("#btnV").on("click", function () {
            iu.limpiar();
            iu.mostrarInicio();
        });
    };

    this.mostrarNick = function (nick) {
        var cadena = '<div id="mN"><label for="mostrarNick"><h5>Info del jugador</h5></label>';
        cadena = cadena + '<div id="mN"><label for="mostrarNick"><span style="font-weight:bold">Nick: </span>' + nick + '</label>';
        this.nick = nick;

        $("#mostrarNick").append(cadena);
    };

    this.mostrarCodigo = function (codigo) {
        var cadena = '<div id="mC"><span style="font-weight:bold">Código: </span>' + codigo + '</div>';

        $("#mostrarCodigo").append(cadena);
    };

    this.mostrarSuerte = function () {
        var cadena = '<div id="mS"><p>¡Mucha suerte!</p></div>';

        $("#mostrarSuerte").append(cadena);
    }

    this.mostrarSalirUsuario = function () {
        var cadena = '<div id="mSalir"><button type="button" id="btnSalir" class="btn btn-outline-danger">Cerrar Sesión</button></div>';

        $("#salirUsuario").append(cadena);

        $("#btnSalir").on("click", function () {

            ws.nick = "";
            ws.codigo = "";

            iu.limpiar();
            //no va
            //ws.cerrarSesion();
            iu.mostrarInicio();

            //quitar cookie
            $.removeCookie("nick");
        })
    };

    this.mostrarAbandonarPartida = function () {
        var cadena = '<div id="mAP"><button type="button" id="btnAbandonar" class="btn btn-outline-danger">Abandonar Partida</button>';

        $("#abandonarPartida").append(cadena);

        $("#btnAbandonar").on("click", function () {

            ws.codigo = "";

            ws.abandonarPartida();
            iu.limpiar();
            iu.mostrarHome();

            iu.mostrarModal("Al abandonar la partida has cerrado la sala.");
        })
    };

    this.mostrarCrearPartida = function () {

        var cadena = '<div id="mCP"><label for="numJug"><h5>Crear partida</h5><h6>¿Cuántos jugadores?</h6></label>';
        cadena = cadena + '<input type="number" class="form-control" placeholder="2-8" id="numJug"></input>';
        cadena = cadena + '<button type="button" id="btnCP" class="btn btn-success">Crear</button>';
        cadena = cadena + '</div>';

        $("#crearPartida").append(cadena);

        $("#btnCP").on("click", function () {
            //codigo que controla el click sobre el btn
            var numero = $('#numJug').val();
            if (numero == "") {
                iu.mostrarAlertaRoja("Introduce el número de jugadores para crear la partida.");
            } else if ((numero < 2) || (numero > 8)) {
                iu.mostrarAlertaRoja("Introduce un número entre 2 y 8 jugadores.");
                $('#numJug').val("");
            }
            else {
                ws.crearPartida(numero, ws.nick);
                console.log(ws.nick);
            }
        });
    }

    this.mostrarEsperando = function () {
        var cadena = '<div id="mEsp"><h6>Espera al resto de jugadores.</h6>';
        cadena = cadena + '<br><div class="spinner-border text-primary"></div></div>';

        $("#esperando").append(cadena);
    };

    this.mostrarTurno = function (nickTurno) {
        $("#mT").remove();

        var cadena = '<div id="mT"><h6>Turno: </h6>' + nickTurno + '</div>';

        $("#mostrarTurno").append(cadena);
    };

    this.mostrarUnirAPartida = function () {

        var cadena = '<div id="mUAP"><label for="code"><h5>Unir a Partida con código</h5></label>';
        cadena = cadena + '<input type="text" class="form-control" placeholder="código" id="code"></input>';
        cadena = cadena + '<button type="button" id="btnUAP" class="btn btn-success">Unirme</button>';
        cadena = cadena + '</div>';

        $("#unirAPartida").append(cadena);

        $("#btnUAP").on("click", function () {
            var code = $('#code').val();
            if (code == "") {
                iu.mostrarAlertaRoja("Introduce un código válido.");
            }
            else {
                ws.unirAPartida(code, ws.nick);
                iu.limpiar();
                iu.mostrarFaseEsperando({ nick: ws.nick, codigo: ws.codigo });
            }
        })
    }

    this.mostrarObtenerTodasPartidas = function (lista) {
        $("#mOTP").remove();

        var cadena = '<div id="mOTP"><label><h5><br>Partidas creadas</h5></label>';
        cadena = cadena + '<div class="list-group">';
        for (i = 0; i < Object.keys(lista).length; i++) {
            cadena = cadena + '<a href="#" class="list-group-item list-group-item-action" value="'
                + lista[i].codigo + '"<span style="font-weight:bold">Código: </span>'
                + lista[i].codigo + ' <span style="font-weight:bold">Dueño: </span>' + lista[i].propietario + '</a>';
        }
        cadena = cadena + '</div>';
        cadena = cadena + '</div>';

        $("#listaPartidas").append(cadena);

        $(".list-group a").click(function () {
            code = $(this).attr("value");
            if (code && ws.nick) {
                ws.unirAPartida(code, ws.nick);
                iu.limpiar();
                iu.mostrarFaseEsperando({ nick: ws.nick, codigo: ws.codigo });
            }
        })
    }

    this.mostrarMano = function (lista) {

        $("#mEsp").remove();
        $("#mMano").remove();

        var cadena = '<div class="list-group" id="mMano">';
        cadena = cadena + '<div class="card-columns">';

        for (i = 0; i < lista.length; i++) {
            cadena = cadena + '<div class="card bg-light" style="width:200px">';
            cadena = cadena + '<div class="card-body text-center">';
            cadena = cadena + '<a href="#" value="' + i + '" class="list-group-item list-group-item-action">';
            cadena = cadena + '<img class="card-img-top" src="cliente/img/' + lista[i].nombre + '.png"></img>';
            cadena = cadena + '</a></div></div>';
        }

        cadena = cadena + '</div></div>';

        $("#mano").append(cadena);

        $(".list-group a").click(function () {
            var number = -1;
            number = $(this).attr("value");
            if (number != -1) {
                ws.jugarCarta(number);
            }
        })
    }

    this.mostrarCartaActual = function (carta) {

        $("#mCA").remove();

        var cadena = '<div class="card-columns" id="mCA">';

        cadena = cadena + '<div class="card bg-light">';
        cadena = cadena + '<div class="card-body text-center">';
        cadena = cadena + '<p class="card-text"><span style="font-weight:bold">CARTA ACTUAL</span><br>Tipo: ' + carta.tipo + '<br>Color: '
            + carta.color + '<br>Valor: ' + carta.valor + '</p>';
        cadena = cadena + '</div></div>';

        cadena = cadena + '</div>';

        $("#cartaActual").append(cadena);
    }

    this.mostrarRobarCarta = function () {
        var cadena = '<div id="mRC"><p>Acciones:</p>';
        cadena = cadena + '<button type="button" id="btnRC" class="btn btn-primary">Robar</button>';

        $("#robarCarta").append(cadena);

        $("#btnRC").on("click", function () {
            ws.robarCarta(1);
        })

    };

    this.mostrarPasarTurno = function () {
        var cadena = '<div id="mPT"><button type="button" id="btnPT" class="btn btn-secondary">Pasar turno</button>';

        $("#pasarTurno").append(cadena);

        $("#btnPT").on("click", function () {
            ws.pasarTurno();
        })

    };

    this.mostrarModal = function (msg) {
        $("#mM").remove();
        var cadena = '<p id="mM">' + msg + '</p>';
        $("#contenidoModal").append(cadena);
        $('#myModal').modal('show');
    }

    this.mostrarAlertaRoja = function (msg) {
        $("#mAlertaAzul").remove();
        $("#mAlertaRoja").remove();
        $("#mAlertaVerde").remove();

        var cadena = '<div id="mAlertaRoja" class="alert alert-danger alert-dismissible">';
        cadena = cadena + '<button type="button" class="close" data-dismiss="alert">&times;</button>';
        cadena = cadena + '<strong>¡Atención! </strong>' + msg + '</div>';
        $("#alerta").append(cadena);
    }

    this.mostrarAlertaVerde = function (msg) {
        $("#mAlertaAzul").remove();
        $("#mAlertaRoja").remove();
        $("#mAlertaVerde").remove();

        var cadena = '<div id="mAlertaVerde" class="alert alert-success alert-dismissible">';
        cadena = cadena + '<button type="button" class="close" data-dismiss="alert">&times;</button>';
        cadena = cadena + '<strong>¡Bien hecho! </strong>' + msg + '</div>';
        $("#alerta").append(cadena);
    }

    this.mostrarAlertaAzul = function (msg) {
        $("#mAlertaAzul").remove();
        $("#mAlertaRoja").remove();
        $("#mAlertaVerde").remove();

        var cadena = '<div id="mAlertaAzul" class="alert alert-primary alert-dismissible">';
        cadena = cadena + '<button type="button" class="close" data-dismiss="alert">&times;</button>';
        cadena = cadena + '<strong>¡Al jugador ' + msg + ' le queda sólo una carta! </strong></div>';
        $("#alerta").append(cadena);
    }
}