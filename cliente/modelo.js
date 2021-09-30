function Juego() {
    this.usuarios = {};
    this.partidas = {};

    this.agregarJugador = function (nick) {
        if (!this.usuarios[nick]) {
            var jugador = new Jugador(nick, this);
            this.usuarios[jugador.nick] = jugador;
        }
        else {
            console.log("El nick ya está en uso");
        }
    }

    this.crearPartida = function (nick, numJug) {
        var codigo = "-1";
        var jugador = this.usuarios[nick];
        codigo = this.obtenerCodigo();
        // while (this.partidas[codigo]) {
        //     codigo = this.obtenerCodigo();
        // };
        var partida = new Partida(codigo, jugador, numJug);
        this.partidas[codigo] = partida;

        return partida;
    }

    this.obtenerTodasPartidas = function () {
        var lista = [];

        for (each in this.partidas) {
            var partida = this.partidas[each];
            lista.push({ propietario: partida.propietario, codigo: each });
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
        // let cadena = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
        // let letras = cadena.split('');
        // let maxCadena = cadena.length;
        // let codigo = [];
        // for (i = 0; i < 6; i++) {
        //     codigo.push(letras[randomInt(1, maxCadena) - 1]);
        // }
        // return codigo.join('');
        return Date.now().toString();
    }

    this.numeroPartidas = function () {
        return Object.keys(this.partidas).length;
    }
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function Jugador(nick, juego) {
    this.nick = nick;
    this.juego = juego;
    this.crearPartida = function (numJug) {
        return this.juego.crearPartida(nick, numJug);
    }
    this.unirAPartida = function (codigo) {
        this.juego.unirAPartida(codigo, nick);
    }
}

function Partida(codigo, jugador, numJug) {
    this.codigo = codigo;
    this.cartas = [];
    this.propietario = jugador.nick;
    this.numJug = numJug;
    this.jugadores = {};
    this.fase = new Inicial();

    this.unirAPartida = function (jugador) {
        this.fase.unirAPartida(this, jugador);
    }
    this.puedeUnirAPartida = function (jugador) {
        this.jugadores[jugador.nick] = jugador;
    }

    this.numeroJugadores = function () {
        return Object.keys(this.jugadores).length;
    }

    this.crearMazo = function () {
        var colores = ["azul", "amarillo", "rojo", "verde"];
        for (i = 0; i < colores.length; i++) {
            this.cartas.push(new Numero(0, colores[i]));
        }

        for (i = 0; i < colores.length; i++) {
            for (j = 1; j < 10; j++) {
                this.cartas.push(new Numero(j, colores[i]));
                this.cartas.push(new Numero(j, colores[i]));
            }
        }

        for (i = 0; i < colores.length; i++) {
            this.cartas.push(new Cambio(20, colores[i]));
            this.cartas.push(new Cambio(20, colores[i]));
        }

        for (i = 0; i < colores.length; i++) {
            this.cartas.push(new Bloqueo(20, colores[i]));
            this.cartas.push(new Bloqueo(20, colores[i]));
        }

        for (i = 0; i < colores.length; i++) {
            this.cartas.push(new Mas2(20, colores[i]));
            this.cartas.push(new Mas2(20, colores[i]));
        }

        for (i = 0; i < colores.length; i++) {
            this.cartas.push(new Comodin(50, "comodin"));
        }

        for (i = 0; i < colores.length; i++) {
            this.cartas.push(new Comodin4(50, "comodin4"));
        }
    }

    this.asignarUnaCarta = function () {
        var numAleatorio = randomInt(1, partida.cartas.length);
        var lista = [];
        var lista = partida.cartas.splice(numAleatorio, 1);
        return lista[0];
    }

    this.dameCartas = function (num) {
        var mano = [];
        for (i = 0; i < num; i++) {
            mano.push(this.asignarUnaCarta());
        }
        return mano;
    }

    this.crearMazo();
    this.unirAPartida(jugador);
}

function Inicial() {
    this.nombre = "inicial";
    this.unirAPartida = function (partida, jugador) {
        //si numero jugadores < numJug
        partida.puedeUnirAPartida(jugador);
        if (partida.numeroJugadores() == partida.numJug) {
            partida.fase = new Jugando();
        }

    }
}

function Jugando() {
    this.nombre = "jugando";
    this.unirAPartida = function (partida, jugador) {
        console.log("La partida ya ha comenzado");
    }
}

function Final() {
    this.nombre = "final";
    this.unirAPartida = function (partida, jugador) {
        console.log("La partida ya ha terminazo");
    }
}

function Numero(valor, color) {
    this.valor = valor;
    this.color = color;
}

function Cambio(valor, color) {
    this.valor = valor;
    this.color = color;
}

function Bloqueo(valor, color) {
    this.valor = valor;
    this.color = color;
}

function Mas2(valor, color) {
    this.valor = valor;
    this.color = color;
}

function Comodin(valor, tipo) {
    this.valor = valor;
    this.tipo = tipo;
}

function Comodin4(valor, tipo) {
    this.valor = valor;
    this.tipo = tipo;
}