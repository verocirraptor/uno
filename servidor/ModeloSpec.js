var modelo = require("./modelo.js");

describe("El juego del UNO", function () {
  var juego;

  beforeEach(function () {
    juego = new modelo.Juego(true);
    juego.agregarJugador("ana");
    juego.agregarJugador("pepe");
    juego.agregarJugador("luis");
  });

  it("Condiciones iniciales", function () {
    expect(juego.numeroPartidas()).toEqual(0);
    expect(juego.obtenerTodasPartidas().length).toEqual(0);
  });

  describe("Ana crea una partida para 2 jugadores", function () {
    var ju1;
    var partida;

    beforeEach(function () {
      ju1 = juego.usuarios["ana"];
      partida = ju1.crearPartida(2);
    });

    it("Comprobar obtener partida", function () {
      var codigo = ju1.codigoPartida;
      expect(ju1.obtenerPartida(codigo)).toBeDefined();
    });

    it("Comprobar mazo", function () {
      expect(partida.mazo.length).toBe(104);
      var rojo = partida.mazo.filter(function (each) {
        return each.color == "rojo";
      });
      expect(rojo.length).toBe(25);

      var verde = partida.mazo.filter(function (each) {
        return each.color == "verde";
      });
      expect(verde.length).toBe(25);

      var amarillo = partida.mazo.filter(function (each) {
        return each.color == "amarillo";
      });
      expect(amarillo.length).toBe(25);

      var azul = partida.mazo.filter(function (each) {
        return each.color == "azul";
      });
      expect(azul.length).toBe(25);

      var mas2 = partida.mazo.filter(function (each) {
        return each.tipo == "mas2";
      });
      expect(mas2.length).toBe(4);

      var mas4 = partida.mazo.filter(function (each) {
        return each.tipo == "mas4";
      });
      expect(mas4.length).toBe(4);

      var comodin = partida.mazo.filter(function (each) {
        return each.tipo == "comodin";
      });
      expect(comodin.length).toBe(4);
    });

    it("Comprobamos la partida para 2 jugadores", function () {
      expect(juego.numeroPartidas()).toEqual(1);
      expect(partida.codigo).toBeDefined();
      expect(partida.numeroJugadores()).toEqual(1);
      expect(juego.obtenerTodasPartidas().length).toEqual(1);
      expect(partida.fase.nombre).toBe("inicial");
    });

    it("Pepe se une", function () {
      var ju2 = juego.usuarios["pepe"];
      ju2.unirAPartida(partida.codigo);
      expect(partida.numeroJugadores()).toEqual(2);
      expect(partida.fase.nombre).toBe("jugando");
    });

    it("Pepe se une y Luis intenta unirse pero no puede", function () {
      var ju2 = juego.usuarios["pepe"];
      ju2.unirAPartida(partida.codigo);
      expect(partida.numeroJugadores()).toEqual(2);
      expect(partida.fase.nombre).toBe("jugando");
      var ju3 = juego.usuarios["luis"];
      ju3.unirAPartida(partida.codigo);
      expect(partida.numeroJugadores()).toEqual(2);
      expect(partida.fase.nombre).toBe("jugando");
    });

    it("Comprobar que el turno inicial funciona", function () {
      var ju2 = juego.usuarios["pepe"];
      ju2.unirAPartida(partida.codigo);
      expect(partida.turno.nick).toBeDefined();
    });

    it("Condiciones de la partida", function () {
      var ju2 = juego.usuarios["pepe"];
      ju2.unirAPartida(partida.codigo);
      ju1.manoInicial();
      ju2.manoInicial();
      expect(ju1.mano.length).toEqual(3);
      expect(ju2.mano.length).toEqual(3);
      expect(partida.turno.nick).toEqual(ju1.nick);
      expect(partida.direccion.nombre).toEqual("derecha");
      expect(partida.cartaActual).toBeDefined();
    });

    it("Comprobar que se obtiene la partida", function () {
      expect(ju1.obtenerPartida(ju1.codigoPartida)).toBeDefined();
    });

    it("Comprobar que se roban cartas", function () {
      var ju2 = juego.usuarios["pepe"];
      ju2.unirAPartida(partida.codigo);
      if (partida.turno.nick == ju1.nick) {
        ju1.manoInicial();
        expect(ju1.mano.length).toEqual(3);
        ju1.robarCarta(3);
        expect(ju1.mano.length).toEqual(6);
      }
      else {
        ju2.manoInicial();
        expect(ju2.mano.length).toEqual(3);
        ju1.robarCarta(3);
        expect(ju2.mano.length).toEqual(6);
      }
    });

    it("Ana intenta robar una carta pero no quedan cartas en el mazo", function () {
      var ju2 = juego.usuarios["pepe"];
      ju2.unirAPartida(partida.codigo);
      ju1.manoInicial();
      ju2.manoInicial();
      expect(partida.mazo.length).toBe(97);
      partida.mesa = partida.mesa.concat(partida.mazo);
      partida.mazo = [];
      expect(partida.mesa.length).toBe(97);
      expect(ju1.mano.length).toBe(3);
      ju1.robarCarta(1);
      expect(ju1.mano.length).toBe(3);
    });

    it("Comprobar que se pasa de turno", function () {
      var ju2 = juego.usuarios["pepe"];
      var jugadorAux;

      ju2.unirAPartida(partida.codigo);
      expect(partida.numeroJugadores()).toEqual(2);
      expect(partida.fase.nombre).toBe("jugando");
      expect(partida.turno.nick).toBeDefined();
      if (partida.turno.nick == ju1.nick) {
        ju1.pasarTurno();
        expect(partida.turno.nick).not.toBe(ju1.nick);
      } else {
        ju2.pasarTurno();
        expect(partida.turno.nick).not.toBe(ju2.nick);
      }
    });

    it("Ana roba todas las cartas del mazo y pierde su turno", function () {
      var ju2 = juego.usuarios["pepe"];
      ju2.unirAPartida(partida.codigo);
      ju1.manoInicial();
      ju2.manoInicial();
      expect(partida.mazo.length).toBe(97);
      expect(ju1.mano.length).toBe(3);
      ju1.robarCarta(97);
      expect(ju1.mano.length).toBe(100);
      expect(partida.turno.nick).toBe(ju1.nick);
      ju1.robarCarta(1);
      expect(partida.turno.nick).toBe(ju2.nick);
    });

    it("Ana usa una carta de bloqueo y Pepe pierde el turno", function () {
      expect(partida.fase.nombre).toEqual("inicial");
      var ju2 = juego.usuarios["pepe"];
      ju2.unirAPartida(partida.codigo);
      ju1.manoInicial();
      ju2.manoInicial();
      expect(partida.fase.nombre).toEqual("jugando");
      var carta = ju1.mano[0];
      expect(ju1.nick).toBe("ana");
      while (!carta || carta.tipo != "bloqueo") {
        carta = ju1.mano.find(function (el) {
          return el.tipo == "bloqueo"
        });
        ju1.robarCarta(1);
      }
      expect(carta.tipo).toEqual("bloqueo");
      var ind = ju1.mano.indexOf(carta);
      expect(ju1.mano[ind].tipo).toEqual("bloqueo");
      partida.cartaActual.color = carta.color;
      expect(partida.turno.nick).toEqual(ju1.nick);
      ju1.jugarCarta(ind);
      expect(partida.cartaActual.tipo).toEqual("bloqueo");
      expect(partida.turno.nick).toEqual(ju1.nick);
      expect(ju2.estado.nombre).toEqual("normal");
    });

    it("Ana usa una carta comodin y se elimina otra al azar de su mano", function () {
      var ju2 = juego.usuarios["pepe"];
      ju2.unirAPartida(partida.codigo);
      ju1.manoInicial();
      ju2.manoInicial();
      var carta = ju1.mano[0];
      expect(ju1.nick).toBe("ana");
      while (!carta || carta.tipo != "comodin") {
        carta = ju1.mano.find(function (el) {
          return el.tipo == "comodin"
        });
        ju1.robarCarta(1);
      }
      expect(carta.tipo).toEqual("comodin");
      var ind = ju1.mano.indexOf(carta);
      expect(ju1.mano[ind].tipo).toEqual("comodin");
      var manoActual = ju1.mano.length;
      expect(partida.turno.nick).toEqual(ju1.nick);
      ju1.jugarCarta(ind);
      expect(partida.cartaActual.tipo).toEqual("comodin");
      var manoConVentaja = manoActual -2;
      expect(ju1.mano.length).toBe(manoComodin);
    });

    it("Ana usa una carta mas2 y Pepe roba dos cartas", function () {
      var ju2 = juego.usuarios["pepe"];
      ju2.unirAPartida(partida.codigo);
      ju1.manoInicial();
      ju2.manoInicial();
      var carta = ju1.mano[0];
      expect(ju1.nick).toBe("ana");
      while (!carta || carta.tipo != "mas2") {
        carta = ju1.mano.find(function (el) {
          return el.tipo == "mas2"
        });
        ju1.robarCarta(1);
      }
      expect(carta.tipo).toEqual("mas2");
      var ind = ju1.mano.indexOf(carta);
      expect(ju1.mano[ind].tipo).toEqual("mas2");
      var manoJU2 = ju2.mano.length;
      partida.cartaActual.color = carta.color;
      expect(partida.turno.nick).toEqual(ju1.nick);
      ju1.jugarCarta(ind);
      expect(partida.cartaActual.tipo).toEqual("mas2");
      var manoResultado = manoJU2 +2;
      expect(ju2.mano.length).toBe(manoResultado);
    });

    it("Ana usa una carta de mas4 y Pepe roba cuatro cartas", function () {
      var ju2 = juego.usuarios["pepe"];
      ju2.unirAPartida(partida.codigo);
      ju1.manoInicial();
      ju2.manoInicial();
      var carta = ju1.mano[0];
      expect(ju1.nick).toBe("ana");
      while (!carta || carta.tipo != "mas4") {
        carta = ju1.mano.find(function (el) {
          return el.tipo == "mas4"
        });
        ju1.robarCarta(1);
      }
      expect(carta.tipo).toEqual("mas4");
      var ind = ju1.mano.indexOf(carta);
      expect(ju1.mano[ind].tipo).toEqual("mas4");
      var manoJU2 = ju2.mano.length;
      partida.cartaActual.color = carta.color;
      expect(partida.turno.nick).toEqual(ju1.nick);
      ju1.jugarCarta(ind);
      expect(partida.cartaActual.tipo).toEqual("mas4");
      var manoResultado = manoJU2 +4;
      expect(ju2.mano.length).toBe(manoResultado);
    });

    it("Ana abandona la partida", function () {
      expect(partida.fase.nombre).toEqual("inicial");
      var ju2 = juego.usuarios["pepe"];
      ju2.unirAPartida(partida.codigo);
      ju1.manoInicial();
      ju2.manoInicial();
      expect(partida.fase.nombre).toEqual("jugando");
      ju1.abandonarPartida();
      expect(partida.fase.nombre).toEqual("final");
    });

    it("Ana cierra sesión", function () {
      expect(partida.fase.nombre).toEqual("inicial");
      var ju2 = juego.usuarios["pepe"];
      ju2.unirAPartida(partida.codigo);
      ju1.manoInicial();
      ju2.manoInicial();
      expect(partida.fase.nombre).toEqual("jugando");
      ju1.abandonarPartida();
      expect(partida.fase.nombre).toEqual("final");
      ju1.cerrarSesion();
      expect(juego.usuarios["ana"]).toBeUndefined();
    });

  });

});