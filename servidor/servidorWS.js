function ServidorWS() {
	//zona cliente del servidor WS
	this.enviarAlRemitente = function (socket, mensaje, datos) {
		socket.emit(mensaje, datos);
	}

	this.enviarATodosMenosRemitente = function (socket, nombre, mensaje, datos) {
		socket.broadcast.to(nombre).emit(mensaje, datos);
	};

	this.enviarATodos = function (io, codigo, mensaje, datos) {
		io.sockets.in(codigo).emit(mensaje, datos)
	}

	this.enviarGlobal = function (socket, mens, datos) {
		socket.broadcast.emit(mens, datos);
	}


	//zona servidor del servidor WS
	this.lanzarServidorWS = function (io, juego) {
		var cli = this;
		io.on("connection", function (socket) {
			console.log("Usuario conectado.");

			socket.on("crearPartida", function (num, nick) {
				var ju1 = juego.usuarios[nick];
				if (ju1) {
					var res = { codigo: -1 };
					var partida = ju1.crearPartida(num);
					if (partida) {
						console.log("Nueva partida de " + nick + " código: " + ju1.codigoPartida);
						res.codigo = ju1.codigoPartida;
						socket.join(res.codigo);
						cli.enviarAlRemitente(socket, "partidaCreada", res);
						var lista = juego.obtenerTodasPartidas();
						cli.enviarGlobal(socket, "nuevaPartida", lista);
					}
					else {
						cli.enviarAlRemitente(socket, "fallo", "La partida no se ha podido crear.");
					}
				}
				else {
					cli.enviarAlRemitente(socket, "fallo", "El usuario no existe.");
				}

			});

			socket.on("unirAPartida", function (codigo, nick) {
				var ju1 = juego.usuarios[nick];
				var res = { codigo: -1 };
				var partida = juego.partidas[codigo];
				if (ju1 && partida) {
					ju1.unirAPartida(codigo);
					res.codigo = ju1.codigoPartida;
					if (res.codigo != -1) {
						socket.join(res.codigo);
						console.log("Jugador " + nick + " se une a partida código: " + ju1.codigoPartida);
						var partida = juego.partidas[codigo];
						cli.enviarAlRemitente(socket, "unidoAPartida", res);
						if (partida.fase.nombre == "jugando") {
							cli.enviarATodos(io, codigo, "pedirCartas", {});
						}
						var lista = juego.obtenerTodasPartidas();
						cli.enviarGlobal(socket, "nuevaPartida", lista);
					}
					else {
						cli.enviarAlRemitente(socket, "fallo", res);
					}
				}
				else {
					cli.enviarAlRemitente(socket, "fallo", "El usuario y/o la partida no existen.");
				}
			});

			socket.on("manoInicial", function (nick) {
				var ju1 = juego.usuarios[nick];
				if (ju1) {
					ju1.manoInicial();
					cli.enviarAlRemitente(socket, "mano", ju1.mano);
					//ahora
					var codigo = ju1.codigoPartida;
					var partida = juego.partidas[codigo];
					var nickTurno = partida.turno.nick;
					cli.enviarAlRemitente(socket, "turno", { turno: nickTurno, cartaActual: partida.cartaActual });
				} else {
					cli.enviarAlRemitente(socket, "fallo", "El usuario no existe.");
				}
			});

			socket.on("manoTurno", function (nick) {
				var ju1 = juego.usuarios[nick];
				if (ju1) {
					cli.enviarAlRemitente(socket, "mano", ju1.mano);
				} else {
					cli.enviarAlRemitente(socket, "fallo", "El usuario no existe.");
				}
			});

			socket.on("jugarCarta", function (nick, num) {
				var ju1 = juego.usuarios[nick];
				ju1.jugarCarta(num);
				cli.enviarAlRemitente(socket, "mano", ju1.mano);
				var codigo = ju1.codigoPartida;
				var partida = juego.partidas[codigo];
				var nickTurno = partida.turno.nick;
				if (ju1.mano.length == 1) {
					cli.enviarATodos(io, codigo, "ultimaCarta", { nick: ju1.nick });
				}
				if (partida.fase.nombre == "final") {
					console.log(partida.fase.nombre);
					console.log(nickTurno);
					cli.enviarATodos(io, codigo, "final", { nick: nickTurno });
				}
				cli.enviarATodos(io, codigo, "turno", { turno: nickTurno, cartaActual: partida.cartaActual });
			});

			socket.on("abandonarPartida", function (nick) {
				var ju1 = juego.usuarios[nick];
				var codigo = ju1.codigoPartida;
				var partida = juego.partidas[codigo];
				var nickTurno = partida.turno.nick;

				cli.enviarATodos(io, codigo, "abandonarPartida", { nick: nickTurno });
			});

			socket.on("robarCarta", function (nick, num) {
				var ju1 = juego.usuarios[nick];
				if (ju1) {

					var res = ju1.robarCarta(num);
					cli.enviarAlRemitente(socket, "mano", ju1.mano);

					if (res == 0) {
						var codigo = ju1.codigoPartida;
						var partida = juego.partidas[codigo];
						var nickTurno = partida.turno.nick;
						cli.enviarATodos(io, codigo, "turno", { turno: nickTurno, cartaActual: partida.cartaActual });
					}
				} else {
					cli.enviarAlRemitente(socket, "fallo", "El usuario no existe.");
				}
			});

			socket.on("pasarTurno", function (nick) {
				var ju1 = juego.usuarios[nick];
				if (ju1) {
					ju1.pasarTurno();
					var codigo = ju1.codigoPartida;
					var partida = juego.partidas[codigo];
					var nickTurno = partida.turno.nick;
					cli.enviarATodos(io, codigo, "turno", { turno: nickTurno, cartaActual: partida.cartaActual });
				}
				else {
					cli.enviarAlRemitente(socket, "fallo", "El usuario no existe.");
				}
			});

			socket.on("abandonarPartida", function (nick) {
				var ju1 = juego.usuarios[nick];
				if (ju1) {
					var codigo = ju1.codigoPartida;
					ju1.abandonarPartida();
					cli.enviarATodosMenosRemitente(socket, codigo, "jugadorAbandona", {});
				}
			});

			socket.on("cerrarSesion", function (nick) {
				var ju1 = juego.usuarios[nick];

				if (ju1) {
					var partida = juego.partidas[ju1.codigoPartida];
					if (partida) {
						ju1.abandonarPartida();
						cli.enviarATodosMenosRemitente(io, ju1.codigoPartida, "jugadorAbandona", {
							turno: partida.turno.nick,
						});
					}
					ju1.cerrarSesion();
					cli.enviarAlRemitente(socket, "usuarioEliminado", {});
				}
			});
		});
	}
}

module.exports.ServidorWS = ServidorWS;