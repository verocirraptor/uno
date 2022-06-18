var cad = require("./cad.js");
var cf = require("./cifrado.js");
var moduloEmail = require("./email.js");

function Juego(test) {
    this.usuarios = {};
    this.partidas = {};
    this.cad;

    this.registrarUsuario = function (email, clave, cb) {
        var ju = this;
        var claveCifrada = cf.encryptStr(clave, 'sEcrEtA');
        var nick = email;
        var key = (new Date().valueOf()).toString();

        this.cad.encontrarUsuarioCriterio({ email: email }, function (usr) {
            if (!usr) {
                ju.cad.insertarUsuario({ email: email, clave: claveCifrada, key: key, nick: nick, confirmada: false }, 
                    function (usu) {
                    cb({ email: 'ok' });
                });
                moduloEmail.enviarEmailConfirmacion(email, key);
            }
            else {
                cb({ email: "nook" })
            }
        })
    }

    this.confirmarUsuario = function (email, key, cb) {
        var ju = this;

        this.cad.encontrarUsuarioCriterio({ email: email, key: key, confirmada: false }, function (usr) {
            if (usr) {
                usr.confirmada = true;
                ju.cad.modificarColeccionUsuarios(usr, function (result) {
                    cb({ res: "ok" });
                })
            }
            else {
                cb({ res: "nook" });
            }
        })
    }

    this.loginUsuario = function (email, clave, cb) {
        var ju = this;
        var nick = email;
        this.cad.encontrarUsuarioCriterio({ email: email }, function (usr) {
            if (usr) {
                var clavedesCifrada = cf.decryptStr(usr.clave, 'sEcrEtA');
                if (clave == clavedesCifrada) {
                    cb(null, usr);
                    ju.agregarJugador(usr.nick);
                    console.log("Usuario " + usr + " inicia sesión.")
                }
                else {
                    cb(null) //clave incorrecta
                }
            }
            else {
                cb(null) //usuario no existe
            }
        });
    };

    this.agregarJugador = function (nick) {
        var res = { "nick": -1 };
        console.log
        if (!this.usuarios[nick]) {
            var jugador = new Jugador(nick, this);
            this.usuarios[nick] = jugador;
            res = { "nick": nick };
            console.log("Jugador " + nick + " agregado.");
        }
        else {
            console.log("El nick " + nick + " ya está en uso.");
        }
        return res;
    }

    this.crearPartida = function (nick, numJug) {
        var codigo = "patata";
        var jugador = this.usuarios[nick];
        var partida;
        if (numJug >= 2 && numJug <= 8) {
            codigo = this.obtenerCodigo();
            while (this.partidas[codigo]) {
                codigo = this.obtenerCodigo();
            };
            partida = new Partida(codigo, jugador, numJug);
            this.partidas[codigo] = partida;
        }
        return partida;
    }

    this.obtenerTodasPartidas = function () {
        var lista = [];
        for (each in this.partidas) {
            var partida = this.partidas[each];
            if (partida.fase.nombre == "inicial") {
                lista.push({ propietario: partida.propietario, codigo: each })
            }
        }
        return lista;
    }

    this.unirAPartida = function (codigo, nick) {
        if (this.partidas[codigo]) {
            var jugador = this.usuarios[nick];
            this.partidas[codigo].unirAPartida(jugador);
        }
    }

    this.obtenerCodigo = function () {
        let cadena = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
        let letras = cadena.split('');
        let maxCadena = cadena.length;
        let codigo = [];
        for (i = 0; i < 6; i++) {
            codigo.push(letras[randomInt(1, maxCadena) - 1]);
        }
        return codigo.join('');
    }

    this.numeroPartidas = function () {
        return Object.keys(this.partidas).length;
    }

    this.borrarUsuario = function (nick) {
        delete this.usuarios[nick];
    }

    this.obtenerTodosResultados = function (callback) {
        this.cad.encontrarTodosResultados(function (lista) {
            callback(lista);
        })
    }

    this.insertarResultado = function (resultado) {
        this.cad.insertarResultado(resultado, function (res) {
            console.log(res);
        })
    }

    this.obtenerResultados = function (criterio, callback) {
        this.cad.encontrarResultadoCriterio(criterio, callback);
    }

    if (!test) {
        this.cad = new cad.CAD();
        this.cad.conectar();
    }
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function Jugador(nick, juego) {
    this.nick = nick;
    this.juego = juego;
    this.mano = [];
    this.codigoPartida;
    this.puntos = 0;
    this.estado = new Normal();
    this.quedaUNO = false;
    this.crearPartida = function (numJug) {
        return this.juego.crearPartida(nick, numJug);
    }
    this.unirAPartida = function (codigo) {
        this.juego.unirAPartida(codigo, nick);
    }

    this.robarCarta = function (num) {
        var numRobadas = -1;
        var partida = this.obtenerPartida(this.codigoPartida);
        if (this.nick == partida.turno.nick && partida.fase.nombre == "jugando") {
            var robadas = partida.dameCartas(num);
            if (robadas.length <= 0) {
                partida.pasarTurno(this.nick);
                numRobadas = 0;
            }
            else {
                this.mano = this.mano.concat(robadas);
                numRobadas = robadas.length;
                this.quedaUNO = false;
            }
        }
        return numRobadas;
    }

    this.manoInicial = function () {
        var partida = this.obtenerPartida(this.codigoPartida);
        this.mano = partida.dameCartas(7);
    }

    this.obtenerPartida = function (codigo) {
        return this.juego.partidas[codigo];
    }

    this.abandonarPartida = function () {
        var partida = this.obtenerPartida(this.codigoPartida);
        if (partida) {
            partida.fase = new Final();
            console.log("La partida ha finalizado.");
        }
    };

    this.pasarTurno = function () {
        var partida = this.obtenerPartida(this.codigoPartida);
        partida.pasarTurno(this.nick);
    }

    this.jugarCarta = function (num) {
        var carta = this.mano[num];
        if (carta) {
            var partida = this.obtenerPartida(this.codigoPartida);
            partida.jugarCarta(carta, this.nick);
        }
    }

    this.quitarCarta = function (carta) {
        var partida = this.obtenerPartida(this.codigoPartida);
        var indice = this.mano.indexOf(carta);
        this.mano.splice(indice, 1);
        if (this.mano.length <= 0) {
            partida.finPartida();
        }
    }

    this.cerrarSesion = function () {
        this.juego.borrarUsuario(this.nick);
    }

    this.eliminarUsuario = function (callback) {
        this.juego.eliminarUsuario(this._id, callback);
    };

    this.insertarResultado = function (prop, numJug) {
        var resultado = new Resultado(prop, this.nick, this.puntos, numJug);
        this.juego.insertarResultado(resultado);
    }

    this.recibeTurno = function (partida) {
        this.estado.recibeTurno(partida, this);
    }

    this.bloquear = function () {
        this.estado = new Bloqueado();
    }

    this.mas2 = function () {
        var partida = this.obtenerPartida(this.codigoPartida);
        var lista = partida.dameCartas(2);
        this.mano = this.mano.concat(lista);
    }

    this.mas4 = function () {
        var partida = this.obtenerPartida(this.codigoPartida);
        var lista = partida.dameCartas(4);
        this.mano = this.mano.concat(lista);
    }

    this.eliminarUnaCartaAleatoria = function () {
        var random = randomInt(1, Object.keys(this.mano).length) - 1;
        var carta = this.mano[random];
        this.quitarCarta(carta);
    }

}

function Normal() {
    this.nombre = "normal";
    this.recibeTurno = function (partida, jugador) {
        partida.jugadorPuedeJugar(jugador);
    }
}
function Bloqueado() {
    this.nombre = "bloqueado";
    this.recibeTurno = function (partida, jugador) {
        partida.jugadorPuedeJugar(jugador);
        jugador.pasarTurno();
        jugador.estado = new Normal();
    }
}

function Partida(codigo, jugador, numJug) {
    this.codigo = codigo;
    this.mazo = [];
    this.propietario = jugador.nick;
    this.numJug = numJug;
    this.jugadores = {};
    this.fase = new Inicial();
    this.ordenTurno = [];
    this.direccion = new Derecha();
    this.turno;
    this.mesa = [];
    this.cartaActual;

    this.unirAPartida = function (jugador) {
        this.fase.unirAPartida(this, jugador);
    }

    this.puedeUnirAPartida = function (jugador) {
        this.jugadores[jugador.nick] = jugador;
        jugador.codigoPartida = this.codigo;
        this.ordenTurno.push(jugador.nick);
    }

    this.numeroJugadores = function () {
        return Object.keys(this.jugadores).length;
    }

    this.crearMazo = function () {
        var colores = ["azul", "amarillo", "rojo", "verde"];
        for (i = 0; i < colores.length; i++) {
            this.mazo.push(new Numero(0, colores[i]));
        }

        for (i = 0; i < colores.length; i++) {
            for (j = 1; j < 10; j++) {
                this.mazo.push(new Numero(j, colores[i]));
                this.mazo.push(new Numero(j, colores[i]));
            }
        }

        for (i = 0; i < colores.length; i++) {
            this.mazo.push(new Cambio(20, colores[i]));
            this.mazo.push(new Cambio(20, colores[i]));
        }

        for (i = 0; i < colores.length; i++) {
            this.mazo.push(new Bloqueo(20, colores[i]));
            this.mazo.push(new Bloqueo(20, colores[i]));
        }

        for (i = 0; i < colores.length; i++) {
            this.mazo.push(new Mas2(20, colores[i]));
            this.mazo.push(new Mas2(20, colores[i]));
        }

        for (i = 0; i < colores.length; i++) {
            this.mazo.push(new Mas4(20, colores[i]));
            this.mazo.push(new Mas4(20, colores[i]));
        }

        for (i = 0; i < colores.length; i++) {
            this.mazo.push(new Comodin(20));
        }
    }

    this.asignarUnaCarta = function () {
        var maxCartas = this.mazo.length;
        var resto;
        if (maxCartas > 0) {
            var indice = randomInt(1, maxCartas) - 1;
            var carta = this.mazo.splice(indice, 1);
            resto = carta[0];
        }
        return resto;
    }

    this.dameCartas = function (num) {
        var cartas = [];
        if (!this.mazo.length < num) {
            this.mazo = this.mazo.concat(this.mesa);
            this.mesa = [];
        }
        for (i = 0; i < num; i++) {
            var carta = this.asignarUnaCarta();
            if (carta) {
                cartas.push(carta);
            }
        }
        return cartas;
    }
    this.pasarTurno = function (nick) {
        this.fase.pasarTurno(nick, this);
    }
    this.puedePasarTurno = function (nick) {
        if (nick == this.turno.nick) {
            this.direccion.pasarTurno(this);
        }
    }

    this.asignarTurno = function () {
        var random = randomInt(1, Object.keys(this.jugadores).length) - 1;
        var nick = this.ordenTurno[random];
        this.turno = this.jugadores[nick];
        console.log(nick + " empieza la partida.");
    }

    this.jugadorPuedeJugar = function (jugador) {
        this.turno = jugador;
    }

    this.jugarCarta = function (carta, nick) {
        this.fase.jugarCarta(carta, nick, this);
    }

    this.puedeJugarCarta = function (carta, nick) {
        if (nick == this.turno.nick) {
            if (this.comprobarCarta(carta)) {
                carta.comprobarEfecto(this);
                this.cambiarCartaActual(carta);
                this.turno.quitarCarta(carta);
                this.pasarTurno(nick);
            }
        }
    }

    this.cambiarCartaActual = function (carta) {
        this.mesa.push(this.cartaActual);
        this.cartaActual = carta;
    }
    this.comprobarCarta = function (carta) {
        return (this.cartaActual.tipo == "numero" && ((this.cartaActual.color == carta.color || this.cartaActual.valor == carta.valor) || carta.tipo == "comodin")
            || this.cartaActual.tipo == "cambio" && ((this.cartaActual.color == carta.color || this.cartaActual.tipo == carta.tipo) || carta.tipo == "comodin")
            || this.cartaActual.tipo == "bloqueo" && ((this.cartaActual.color == carta.color || this.cartaActual.tipo == carta.tipo) || carta.tipo == "comodin")
            || this.cartaActual.tipo == "mas2" && ((this.cartaActual.color == carta.color || this.cartaActual.tipo == carta.tipo) || carta.tipo == "comodin")
            || this.cartaActual.tipo == "mas4" && ((this.cartaActual.color == carta.color || this.cartaActual.tipo == carta.tipo) || carta.tipo == "comodin")
            || this.cartaActual.tipo == "comodin");
    }

    this.cartaInicial = function () {
        this.cartaActual = this.asignarUnaCarta();
    }

    this.cambiarDireccion = function () {
        if (this.direccion.nombre == "derecha") {
            this.direccion = new Izquierda();
        }
        else {
            this.direccion = new Derecha();
        }
    }

    this.finPartida = function () {
        this.fase = new Final();
        this.calcularPuntos();
        this.turno.insertarResultado(this.propietario, this.numJug);
    }

    this.calcularPuntos = function () {
        var suma = 0;
        for (var jug in this.jugadores) {
            for (i = 0; i < this.jugadores[jug].mano.length; i++) {
                suma = suma + this.jugadores[jug].mano[i].valor;
            }
        }
        this.turno.puntos = suma;
    }

    this.bloquearSiguiente = function () {
        var jugador = this.direccion.obtenerSiguiente(this);
        jugador.bloquear();
    }

    this.mas2Siguiente = function () {
        var jugador = this.direccion.obtenerSiguiente(this);
        jugador.mas2();
    }

    this.mas4Siguiente = function () {
        var jugador = this.direccion.obtenerSiguiente(this);
        jugador.mas4();
    }

    this.eliminaUnaCartaAleatoria = function () {
        var jugador = this.turno;
        jugador.eliminarUnaCartaAleatoria();
    }

    this.crearMazo();
    this.unirAPartida(jugador);
}

function Derecha() {
    this.nombre = "derecha";
    this.pasarTurno = function (partida) {
        var nick = partida.turno.nick;
        var indice = partida.ordenTurno.indexOf(nick);
        var siguiente = (indice + 1) % (Object.keys(partida.jugadores).length);
        var jugador = partida.jugadores[partida.ordenTurno[siguiente]];
        jugador.recibeTurno(partida);
    }

    this.obtenerSiguiente = function (partida) {
        var nick = partida.turno.nick;
        var indice = partida.ordenTurno.indexOf(nick);
        var siguiente = (indice + 1) % (Object.keys(partida.jugadores).length);
        var jugador = partida.jugadores[partida.ordenTurno[siguiente]];
        return jugador;
    }
}

function Izquierda() {
    this.nombre = "izquierda";
    this.pasarTurno = function (partida) {
        var nick = partida.turno.nick;
        var indice = partida.ordenTurno.indexOf(nick);
        var siguiente = (indice - 1) % (Object.keys(partida.jugadores).length);
        if (siguiente < 0) { siguiente = Object.keys(partida.jugadores).length - 1 }
        var jugador = partida.jugadores[partida.ordenTurno[siguiente]];
        jugador.recibeTurno(partida);
    }

    this.obtenerSiguiente = function (partida) {
        var nick = partida.turno.nick;
        var indice = partida.ordenTurno.indexOf(nick);
        var siguiente = (indice - 1) % (Object.keys(partida.jugadores).length);
        if (siguiente < 0) { siguiente = Object.keys(partida.jugadores).length - 1 }
        var jugador = partida.jugadores[partida.ordenTurno[siguiente]];
        return jugador;
    }
}

function Inicial() {
    this.nombre = "inicial";
    this.unirAPartida = function (partida, jugador) {
        partida.puedeUnirAPartida(jugador);
        if (partida.numeroJugadores() == partida.numJug) {
            partida.fase = new Jugando();
            partida.asignarTurno();
            partida.cartaInicial();
        }
    }
    this.jugarCarta = function (carta, nick, partida) {
        console.log("La partida todavía no ha empezado.");
    }
    this.pasarTurno = function (nick, partida) {
        console.log("La partida todavía no ha empezado.");
    }
}

function Jugando() {
    this.nombre = "jugando";
    this.unirAPartida = function (partida, jugador) {
        console.log("La partida ya ha empezado.");
        jugador.codigoPartida = -1;
    }
    this.jugarCarta = function (carta, nick, partida) {
        partida.puedeJugarCarta(carta, nick);
    }
    this.pasarTurno = function (nick, partida) {
        partida.puedePasarTurno(nick);
    }
}

function Final() {
    this.nombre = "final";
    this.unirAPartida = function (partida, jugador) {
        console.log("La partida ya ha finalizado.");
        jugador.codigoPartida = -1;
    }
    this.jugarCarta = function (carta, nick, partida) {
        console.log("La partida ya ha finalizado.");
    }
    this.pasarTurno = function (nick, partida) {
        console.log("La partida ya ha finalizado.");
    }
}

function Numero(valor, color) {
    this.tipo = "numero";
    this.valor = valor;
    this.color = color;
    this.nombre = color + valor;
    this.comprobarEfecto = function (partida) {}
}

function Cambio(valor, color) {
    this.tipo = "cambio";
    this.valor = valor;
    this.color = color;
    this.nombre = color + "cambio";
    this.comprobarEfecto = function (partida) {
        partida.cambiarDireccion();
    }
}

function Bloqueo(valor, color) {
    this.tipo = "bloqueo";
    this.valor = valor;
    this.color = color;
    this.nombre = color + "bloqueo";
    this.comprobarEfecto = function(partida) {
        partida.bloquearSiguiente();
    }
}

function Mas2(valor, color) {
    this.tipo = "mas2";
    this.valor = valor;
    this.color = color;
    this.nombre = color + "mas2";
    this.comprobarEfecto = function(partida) {
        partida.mas2Siguiente();
    }
}

function Mas4(valor, color) {
    this.tipo = "mas4";
    this.valor = valor;
    this.color = color;
    this.nombre = color + "mas4";
    this.comprobarEfecto = function(partida) {
        partida.mas4Siguiente();
    }
}

function Comodin(valor) {
    this.tipo = "comodin";
    this.color = "blanco";
    this.valor = valor;
    this.nombre = "comodin";
    this.comprobarEfecto = function (partida) {
        partida.eliminaUnaCartaAleatoria();
    }
}

function Resultado(prop, ganador, puntos, numJug) {
    this.propietario = prop;
    this.ganador = ganador;
    this.puntos = puntos;
    this.numeroJugadores = numJug;
}

module.exports.Juego = Juego;