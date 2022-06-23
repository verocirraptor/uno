function ClienteWS() {
	this.socket;
	this.nick;
	this.codigo;

	this.conectar = function () {
		this.socket = io();
		this.servidorWSCliente();
	}

	this.crearPartida = function (num, nick) {
		this.nick = nick;
		this.socket.emit("crearPartida", num, nick);
	}

	this.unirAPartida = function (codigo, nick) {
		this.nick = nick;
		this.codigo = codigo;
		this.socket.emit("unirAPartida", codigo, nick);
	}

	this.manoInicial = function () {
		this.socket.emit("manoInicial", this.nick);
	}

	this.obtenerMano = function(){
		this.socket.emit("manoTurno", this.nick);
	}

	this.jugarCarta = function (num) {
		this.socket.emit("jugarCarta", this.nick, num);
	}

	this.robarCarta = function (num) {
		this.socket.emit("robarCarta", this.nick, num);
	}

	this.pasarTurno = function () {
		this.socket.emit("pasarTurno", this.nick);
	}

	this.abandonarPartida = function () {
		this.socket.emit("abandonarPartida", this.nick);
	}
	
	this.cerrarSesion = function () {
		this.socket.emit("cerrarSesion", this.nick);
	}

	//servidor WS del cliente	
	this.servidorWSCliente = function () {
		var cli = this;
		this.socket.on("connect", function () {
			console.log("Conectado al servidor WS.");
		});

		this.socket.on("partidaCreada", function (data) {
			console.log(data);
			cli.codigo = data.codigo;
			iu.limpiar();
			iu.mostrarFaseEsperando({ nick: cli.nick, codigo: cli.codigo });
			iu.mostrarAlertaVerde("Ahora comparte este código " + cli.codigo + " para jugar con amigos.");
		});

		this.socket.on("nuevaPartida", function (lista) {
			if ((!cli.codigo) && (cli.nick)) {
				iu.mostrarObtenerTodasPartidas(lista);
			}
		});

		this.socket.on("unidoAPartida", function (data) {
			console.log(data);
			cli.codigo = data.codigo;
		});

		this.socket.on("pedirCartas", function (data) {
			cli.manoInicial();
			iu.limpiar();
			iu.mostrarJugando({ nick: cli.nick, codigo: cli.codigo});
		});

		this.socket.on("mano", function (data) {
			console.log(data);
			iu.mostrarMano(data);
		});

		this.socket.on("ultimaCarta", function (data) {
			console.log(data);
			iu.mostrarAlertaAzul(data.nick);
		});

		this.socket.on("abandonarPartida", function (data) {
			if (cli.codigo) {
				cli.codigo = "";
				ws.abandonarPartida();
				iu.limpiar();
				iu.mostrarHome();
				iu.mostrarModal("El jugador " + data.nick + " ha abandonado la partida y ha cerrado la sala.");
			}
		});

		this.socket.on("turno", function (data) {
			console.log(data);
			iu.mostrarCartaActual(data.cartaActual);
			iu.mostrarTurno(data.turno);
			cli.obtenerMano();
		});

		this.socket.on("final", function (data) {
			cli.codigo = "";
			ws.abandonarPartida();
			iu.limpiar();
			iu.mostrarModal("El jugador " + data.nick + " ha ganado la partida.");
			iu.mostrarHome();
		});

		this.socket.on("fallo", function (data) {
			console.log(data);
			iu.mostrarModal(data);
			iu.mostrarHome();
		});

		this.socket.on("usuarioEliminado", function () {
			cli.nick = "";
			cli.codigo = "";
			$.removeCookie("nick");
			iu.limpiar();
			iu.mostrarAgregarJugador();
		});
	}

	this.conectar();
}