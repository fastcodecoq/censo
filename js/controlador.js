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

                                            $("input[name='local']").val( img );

                                       }


                                       var call_error = function(){

                                          alert("no se ha podido obtener la imagen");

                                       }


                                       tomarFoto(call_ok, call_error);


                                break;


                                case "recibo":

                                    var call_ok = function( img ){

                                            $("input[name='recibo']").val( img );

                                       }


                                       var call_error = function(){

                                          alert("no se ha podido obtener la imagen");

                                       }


                                       tomarFoto(call_ok, call_error);

                                break;


                            }

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


        function tomarFoto(call_ok , call_error) {
           
              navigator.camera.getPicture( call_ok , call_error , { quality: 50 });

          }


      //===================================



       $(document).ready(function(){

            listHash();  

       });