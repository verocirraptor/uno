var mongo = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

function CAD() {
    this.resultCol = undefined;
    this.usersCol = undefined;

    this.encontrarTodosUsuarios = function (callback) {
        encontrarTodos(this.usersCol, callback);
    }

    this.encontrarUsuarioCriterio = function (criterio, callback) {
        encontrarCriterio(this.usersCol, criterio, callback);
    }

    this.insertarUsuario = function(usuario, callback){
        insertar(this.usersCol,usuario,callback);
    }

    this.encontrarTodosResultados = function (callback) {
        encontrarTodos(this.resultCol, callback);
    }

    this.encontrarResultadoCriterio = function (criterio, callback) {
        encontrarCriterio(this.resultCol, criterio, callback);
    }

    this.modificarColeccionUsuarios=function(usuario, callback){
        modificarColeccion(this.usersCol, usuario, callback);
    }

    function modificarColeccion(coleccion, usr, callback){
        coleccion.findOneAndUpdate({ _id: usr._id }, {$set:usr}, {upsert:false}, function (err, result) {
            if (err) {
                console.log("No se ha podido actualizar la colección.");
            }
            else {
                console.log("Colección actualizada.");
            }
            callback(result);
        });
    }


    function encontrarCriterio(coleccion, criterio, callback) {
        coleccion.find(criterio).toArray(function (err, usr) {
            if (usr.length == 0) {
                callback(undefined);
            }
            else {
                callback(usr[0]);
            }
        })
    };


    function encontrarTodos(coleccion, callback) {
        coleccion.find().toArray(function (err, datos) {
            if (err) {
                callback([]);
            }
            else {
                callback(datos);
            }
        });
    }

    this.insertarResultado = function (resultado, callback) {
        insertar(this.resultCol, resultado, callback);
    }

    this.insertarUsuario = function (usuario, callback) {
        insertar(this.usersCol, usuario, callback);
    }

    function insertar(coleccion, objeto, callback) {
        coleccion.insertOne(objeto, function (err, result) {
            if (err) {
                console.log("No se ha podido añadir el objeto.");
            } else {
                console.log("Objeto insertado.");
                callback(result);
            }
        })
    };

    this.eliminarUsuario=function(uid,callback){
    	eliminar(this.usersCol,{_id:ObjectID(uid)},callback);
    }


    function eliminar(collection,criterio,callback){ 
        collection.deleteOne(criterio,function(err,result){
            if(err){
                console.log("No se ha podido eliminar el usuario.");
            }
            else{
                console.log("Usuario eliminado.");
                callback(result);
            }
        });
    }

    this.conectar = function (callback) {
        var cad = this;
        mongo.connect("mongodb+srv://patata:patata@clusteruno.qdqlg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", function (err, db) {
            if (err) {
                console.log("Error al conectar a la base de datos.");

            } else {
                console.log("Conectado a la base de datos.");
                cad.resultCol = db.db("UNO").collection("resultados");
                cad.usersCol = db.db("UNO").collection("usuarios");
            }
        })
    }
}

module.exports.CAD = CAD;