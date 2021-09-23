describe("El juego del UNO", function () {
  var juego;

  beforeEach(function () {
    juego = new Juego();
    juego.agregarJugador("ana");
    juego.agregarJugador("pepe");
    juego.agregarJugador("luis");
  });

  it("ana crea una partida para 2 jugadores", function () {
    var ju1 = juego.usuarios["ana"];
    expect(juego.numeroPartidas()).toEqual(0);
    var partida = ju1.crearPartida(2);
    expect(juego.numeroPartidas()).toEqual(1);
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
