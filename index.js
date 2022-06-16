var fs = require("fs");
var express = require("express");
var app = express();
var http = require("http").Server(app);
var { Server } = require("socket.io");
var io = new Server(http);
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var cookieSession = require("cookie-session");

require("./servidor/passport-setup.js");

var modelo = require("./servidor/modelo.js");
var ssrv = require("./servidor/servidorWS.js");

var juego = new modelo.Juego(false);
var servidorWS = new ssrv.ServidorWS();

app.set('port', process.env.PORT || 5000);

app.use(express.static(__dirname + "/"));

app.use(cookieSession({
    name: 'cartasuno',
    keys: ['key1', 'key2']
}));

passport.use(new LocalStrategy({ usernameField: "email", passwordField: "clave" },
    function (email, clave, done) {
        juego.loginUsuario(email, clave, function (err, user) {
            if (err) {
                return done(err);
            }
            else {
                return done(null, user);
            }
        })
    }
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(passport.initialize());
app.use(passport.session());

const haIniciado = function (request, response, next) {
    if (request.user) {
        next();
    } else {
        response.redirect('/');
    }
}

app.get("/", function (request, response) {
    var contenido = fs.readFileSync(__dirname + "/cliente/index.html");
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});


app.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get("/good", function (request, response) {
    var nick = request.user.emails[0].value;
    juego.agregarJugador(nick);
    response.cookie('nick', nick);
    response.redirect("/");
})

app.get("/fallo", function (request, response) {
    response.send({ nick: "nook" });
})

app.get("/google/callback", passport.authenticate('google', { failureRedirect: '/fallo' }),
    function (request, response) {
        response.redirect("/good");
    });

app.post('/registrarUsuario', function (request, response) {
    var email = request.body.email;
    var clave = request.body.clave;

    juego.registrarUsuario(email, clave, function (data) {
        response.send(data);
    });
})

app.post('/loginUsuario', passport.authenticate("local",
    {
        failureRedirect: "/fallo", successRedirect: "/ok"
    }
));

app.get("/ok", haIniciado, function (request, response) {
    response.send({ nick: request.user.nick });
});

app.get("/confirmarUsuario/:direccion/:key", function (request, response) {
    var email = request.params.direccion;
    var key = request.params.key;

    juego.confirmarUsuario(email,key,function(data){
        response.redirect("/");
    });
});

app.get("/crearPartida/:num/:nick", haIniciado, function (request, response) {
    var nick = request.params.nick;
    var num = request.params.num;
    var ju1 = juego.usuarios[nick];
    var res = { codigo: -1 };
    if (ju1) {
        var partida = ju1.crearPartida(num);
        console.log("Nueva partida de " + nick + " codigo: " + ju1.codigoPartida);
        res.codigo = ju1.codigoPartida;
    }
    response.send(res);
})

app.get("/unirAPartida/:nick/:codigo", function (request, response) {
    var nick = request.params.nick;
    var codigo = request.params.codigo;
    var ju2 = juego.usuarios[nick];

    var res = { code: -1 };
    if (juego.partidas[codigo] && (!juego.partidas[codigo].jugadores[nick])) {
        ju2.unirAPartida(codigo);
        res.code = 500;
    }
    response.send(res);
})

app.get("/obtenerTodasPartidas", haIniciado, function (request, response) {

    var lista = [];

    lista = juego.obtenerTodasPartidas();

    response.send(lista);
})

app.get("/jugarCarta/:nick/:numero", function (request, response) {
    var nick = request.params.nick;
    var numeroCarta = request.params.numero;
    var jugador = juego.usuarios[nick];

    var res = { code: -1 };
    if (jugador.mano.length != 0) {
        jugador.jugarCarta(numeroCarta);
        res.code = 500;//si funciona bien
    }
    response.send(res);
})

app.get("/robarCarta/:nick/:numero", function (request, response) {
    var nick = request.params.nick;
    var cartasARobar = request.params.numero;
    var jugador = juego.usuarios[nick];

    var res = { code: -1 };
    if (jugador.mano) {
        jugador.robar(cartasARobar);
        res.code = 500;
    }
    response.send(res);
})

app.get("/obtenerTodosResultados", haIniciado, function (request, response) {
    if (juego) {
        juego.obtenerTodosResultados(function (lista) {
            response.send(lista);
        });
    }
})

app.get("/obtenerResultados/:nick", function (request, response) {
    var nick = request.params.nick;
    if (juego) {
        juego.obtenerResultados({ ganador: nick }, function (lista) {
            response.send(lista);
        });
    }
})

app.get("/cerrarSesion/:nick", function (request, response) {
    var nick = request.params.nick;
    var ju1 = juego.usuarios[nick];
    if (ju1) {
        ju1.cerrarSesion();
        response.send({ res: "ok" });
    }
})

http.listen(app.get('port'), function () {
    console.log("La app NodeJS se está ejecutando en el puerto ", app.get("port"));
});

servidorWS.lanzarServidorWS(io, juego);