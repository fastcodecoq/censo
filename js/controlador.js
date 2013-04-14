var socket = io.connect('http://apmontelibano.com:8888');


      function listHash(){


          $("a[href^='#']").on("click", function(){

                var cmd = $(this).attr("href").replace("#","");

                switch(cmd){

                    case "abrir": 

                        var rel = $(this).attr("rel");

                        abrir(rel);

                    break;

                    case "cerrar":

                    var rel = $(this).attr("rel");

                        cerrar(rel);

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


      function addUsuario(){




      }

       $(document).ready(function(){

            listHash();  

       });