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


                                       var call_ok = function( img ){

                                            alert(img)

                                       };


                                       var call_error = function(){

                                          alert("no se ha podido obtener la imagen");

                                       };


                                       tomarFoto(call_ok, call_error);


                                break;


                                case "recibo":

                                    var call_ok = function( img ){

                                              alert(img)

                                       };


                                       var call_error = function(){

                                          alert("no se ha podido obtener la imagen");

                                       };


                                       tomarFoto(call_ok, call_error);

                                break;


                            }

                    break;


                    case "cargar":

                      checkConnection();

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


        function tomarFoto(call_ok , call_error) {
           
              navigator.camera.getPicture( call_ok , call_error , { quality: 50 });

          }


      //===================================



      // eventos de conexion


      function checkConnection() {

         var networkState = navigator.network.connection.type;

         var states = {};

            states[Connection.UNKNOWN]  = 'Conexión desconocida';
            states[Connection.ETHERNET] = 'Conexión ethernet';
            states[Connection.WIFI]     = 'Conexión WiFi';
            states[Connection.CELL_2G]  = 'Conexión movil 2G';
            states[Connection.CELL_3G]  = 'Conexión movil 3G';
            states[Connection.CELL_4G]  = 'Conexión movil 4G';
            states[Connection.NONE]     = 'Sin conexión';

        alert('Tipo de conexión: ' + states[networkState]);

    }




      //================================



       $(document).ready(function(){

            listHash();  

       });