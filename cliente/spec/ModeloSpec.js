describe("El juego del UNO", function () {
  var juego;

  beforeEach(function () {
    juego = new Juego();
    juego.agregarJugador("ana");
    juego.agregarJugador("pepe");
    juego.agregarJugador("luis");
  });

  it("Comprobar mazo", function () {
    var ju1 = juego.usuarios["ana"];
    expect(juego.numeroPartidas()).toEqual(0);
    expect(juego.obtenerTodasPartidas().length).toEqual(0);
    var partida = ju1.crearPartida(2);

    expect(partida.cartas.length).toBe(108);
    var rojo = partida.cartas.filter(function (each) {
      return each.color == "rojo";
    });
    expect(rojo.length).toBe(25);

    var verde = partida.cartas.filter(function (each) {
      return each.color == "verde";
    });
    expect(verde.length).toBe(25);

    var amarillo = partida.cartas.filter(function (each) {
      return each.color == "amarillo";
    });
    expect(amarillo.length).toBe(25);

    var azul = partida.cartas.filter(function (each) {
      return each.color == "azul";
    });
    expect(azul.length).toBe(25);

    var comodin = partida.cartas.filter(function (each) {
      return each.tipo == "comodin";
    });
    expect(comodin.length).toBe(4);

    var comodin4 = partida.cartas.filter(function (each) {
      return each.tipo == "comodin4";
    });
    expect(comodin4.length).toBe(4);
  });

  it("ana crea una partida para 2 jugadores", function () {
    var ju1 = juego.usuarios["ana"];
    expect(juego.numeroPartidas()).toEqual(0);
    expect(juego.obtenerTodasPartidas().length).toEqual(0);
    var partida = ju1.crearPartida(2);
    expect(juego.numeroPartidas()).toEqual(1);
    expect(juego.obtenerTodasPartidas().length).toEqual(1);
    expect(partida.codigo).toBeDefined();
    expect(partida.numeroJugadores()).toEqual(1);
    expect(partida.fase.nombre).toBe("inicial");
  });

  it("ana crea una partida para 2 jugadores y pepe se une", function () {
    var ju1 = juego.usuarios["ana"];
    expect(juego.numeroPartidas()).toEqual(0);
    var partida = ju1.crearPartida(2);
    expect(juego.numeroPartidas()).toEqual(1);
    expect(partida.codigo).toBeDefined();
    expect(partida.numeroJugadores()).toEqual(1);
    expect(partida.fase.nombre).toBe("inicial");
    var ju2 = juego.usuarios["pepe"];
    ju2.unirAPartida(partida.codigo);
    expect(partida.numeroJugadores()).toEqual(2);
    expect(partida.fase.nombre).toBe("jugando");
  });

  it("ana crea una partida para 2 jugadores, pepe se une y luis intenta unirse", function () {
    var ju1 = juego.usuarios["ana"];
    expect(juego.numeroPartidas()).toEqual(0);
    var partida = ju1.crearPartida(2);
    expect(juego.numeroPartidas()).toEqual(1);
    expect(partida.codigo).toBeDefined();
    expect(partida.numeroJugadores()).toEqual(1);
    expect(partida.fase.nombre).toBe("inicial");
    var ju2 = juego.usuarios["pepe"];
    ju2.unirAPartida(partida.codigo);
    expect(partida.numeroJugadores()).toEqual(2);
    expect(partida.fase.nombre).toBe("jugando");
    var ju3 = juego.usuarios["luis"];
    ju3.unirAPartida(partida.codigo);
    expect(partida.numeroJugadores()).toEqual(2);
    expect(partida.fase.nombre).toBe("jugando");
  });

});
