var socket = io.connect('http://apmontelibano.com:8888');


      function listHash(){


          $("a[href^='#']").on("click", function(){

                var cmd = $(this).attr("href").replace("#","");

                switch(cmd){

                    case "abrir": 

                        var rel = $(this).attr("rel");

                        abrir(rel);

                        camb_href( {obj : $(this) , href : "#cerrar"} );

                    break;

                    case "cerrar":

                    var rel = $(this).attr("rel");

                        cerrar(rel);

                        camb_href( {obj : $(this) , href : "#abrir"} );

                    break;


                    case "foto":

                          var tipo = $(this).attr("rel");

                            switch(tipo){

                                case "local":


                                       tomarFoto();


                                break;


                                case "recibo":

                                       tomarFoto();

                                break;


                            }

                    break;


                    case "cargar":

                      var estado = checkConnection();                      

                      if(!estado)
                        alert("no hay conexion");
                      else
                        alert("Hay conexion");


                    break;

                }


          });


      }


      function abrir( val ){

            $(val).css({ display : "block" });

      }


       function cerrar( val ){

              $(val).css({ display : "none" });

      }


      function camb_href( vars ){

            vars.obj.attr("href", vars.href);                    

      }


      function addUsuario(){




      }


      //eventos camara


       var pictureSource;   // Origen de la imagen
       var destinationType; // Formato del valor retornado

    // Espera a que PhoneGap conecte con el dispositivo.
    //
      document.addEventListener("deviceready",onDeviceReady,false);

    // PhoneGap esta listo para usarse!
    //
       function onDeviceReady() {

          pictureSource=navigator.camera.PictureSourceType;
          destinationType=navigator.camera.DestinationType;

        }


        function tomarFoto() {
           
              navigator.camera.getPicture( onSuccess , onFail , { quality: 50 });

          }



 function onSuccess(imageURI) {
      alert(imageURI);
}

function onFail(message) {
    alert('Ocurrió un error: ' + message);
}


      //===================================



      // eventos de conexion


      function checkConnection() {

         var networkState = navigator.network.connection.type;

         var states = {};

            states[Connection.UNKNOWN]  = true;
            states[Connection.ETHERNET] = true;
            states[Connection.WIFI]     = true;
            states[Connection.CELL_2G]  = true;
            states[Connection.CELL_3G]  = true;
            states[Connection.CELL_4G]  = true;
            states[Connection.NONE]     = false;

        return  states[networkState];

    }




      //================================



       $(document).ready(function(){

            listHash();  

       });