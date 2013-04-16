var socket = io.connect('http://apmontelibano.com:8888');
var ls = window.localStorage;
var it_sinc = 0;
var count = 1;


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

                                            alert(img);

                                       };


                                       var call_error = function(){

                                          alert("no se ha podido obtener la imagen");

                                       };


                                       tomarFoto(call_ok, call_error);


                                break;


                                case "recibo":

                                    var call_ok = function( img ){

                                            $("input[name='recibo']").val( img );
                                            alert(img);

                                       };



                                       var call_error = function(){

                                          alert("no se ha podido obtener la imagen");

                                       };


                                       tomarFoto( call_ok, call_error);

                                break;


                            }

                    break;


                    case "cargar":

                      var estado = checkConnection();  
                      var usuario;                    

                  if(!validar_form()){

                     alert("Debes llenar los campos con *");
                     return;

                      }
                   else
                     usuario = obt_vars();
            

                  
                  if(!calcular_nivel( usuario )){
                         
                         alert("ancho y profundidad deben ser númericos");
                         return;

                       }


       usuario = obt_vars();


                      if(!estado)
                        {
                            
                           salvarLS( usuario , function(){

                                alert("Sin conexion: Guardado localmente. Cuando halla cobertura pulse Sincronizar");

                           });


                        }
                      else
                        {

                           console.log(usuario)
                           socket.emit("guardar", { info : usuario, tipo: "normal"} );


                        }


                    break;


                    case "sincronizar":

                        sincronizar();

                    break;

                }


          });


      }


      function validar_form(){

          var els = $("form#add_usuario .require"),
              cond = true;          

          for(i=0; i < els.length ; i++){

                var it = $(els[i]).val() ;
         

                if(it == ""){

                             console.log(it + " " + $(it[i]).attr("name"));
                                cond = false;


                }
               
          }


          return cond;


      }



      function sincronizar(){


               info = obtLS();
               it_sinc = info.length;

               if(!info.length > 0){
                
                  alert("No hay datos locales para sincronizar");
                  return false;

                }


                if( !checkConnection() )
                    {

                       alert("Para sincronizar debes tener cobertura");
                       return false;

                    }

               for( i = 0 ; i < info.length ; i++){

                   socket.emit("guardar", { info : info[i], tipo: "sincro" } );

               }


               cleanLS();


      }


      function limpiar_form( form ){

           var inputs = $(form + " input");


           for(i = 0 ; i < inputs.length ; i++){
                
                if($(inputs[i]).attr("name") != "local" && $(inputs[i]).attr("name") != "recibo" && $(inputs[i]).attr("name") != "nivel" )          
                  $(inputs[i]).val("");

               }

      }


      function calcular_nivel( usuario ){

             if( !/^([0-9])*$/.test( parseInt(usuario.ancho) ) || !/^([0-9])*$/.test( parseInt(usuario.largo) ) )
                return false;
              else
              { 

                 var nivel = 0,
                     area = usuario.ancho * usuario.largo;

                if( area > 0 && area <= 16 )
                     nivel = 1;
                if( area > 16 && area < 50)
                     nivel = 2;
                if( area >= 50 )
                     nivel = 3;                 


              }

               $("#add_usuario input[name='nivel']").val( nivel );

              return true;

      }


      function obt_vars(){

            var usuario = {

               nombre : $("form#add_usuario input[name='nombre']").val(),
               nic : $("form#add_usuario input[name='nic']").val(),               
               nit: $("form#add_usuario input[name='nit']").val(),
               ancho : trim($("form#add_usuario input[name='ancho']").val()),
               largo : trim($("form#add_usuario input[name='largo']").val()),
               nivel : $("form#add_usuario input[name='nivel']").val(),
               recibo : $("form#add_usuario input[name='recibo']").val(),
               local : $("form#add_usuario input[name='local']").val()

            }


            console.log(usuario);

            return usuario;

      }


      function nivel_camb(){

          $("#nivel input[type='radio']").change(function(){ 

                $("input[name='nivel']").val($(this).val());

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
           
              navigator.camera.getPicture( call_ok , call_error , { quality: 50, destinationType: Camera.DestinationType.FILE_URI } );

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



    function salvarLS( val , callback ){


          var user = val,
              its = obtLS();

              its.push( user );
              its = toJSON( its );              

              ls.usuarios = its;    


              if(callback)
                   callback();          


    }


    function obtLS(){

        return toOBJ ( ls.usuarios );

    }


    function cleanLS(){

           ls.removeItem('usuarios');
           iniLS();

    }


    function toJSON( val ){

       return JSON.stringify( val );

    }

    function toOBJ( val ){

          return JSON.parse( val );
    }

    function iniLS( val ){



      if(!ls.usuarios)
          ls.setItem('usuarios', toJSON( new Array() ) );
       else
        console.log( obtLS() );

   
      }



      function ons(){

        

          socket.on("guardado", function(data){

                  console.log(data);
         

                  if( data.success != 0){
   
                   switch(data.tipo){

                    case "normal":

                    alert("guardado");
                    limpiar_form("#add_usuario");

                    break;


                    case "sincro":


                    console.log(it_sinc + " == " + count);

                      if(count == it_sinc){
                         
                         alert("Se ha sincronizado correctamente");
                         count = 1;

                       }


                       count++;

                    break;


                   }
                   

                  }
                  else
                    alert("No guardado, intenta de nuevo");

          });

      }


      function ini(){

        listHash(); 
        nivel_camb();
        iniLS();
        ons();

      }






       $(document).ready(function(){


             ini();
             

       });



       // otros phpjs

function trim (str, charlist) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: mdsjack (http://www.mdsjack.bo.it)
  // +   improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
  // +      input by: Erkekjetter
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: DxGx
  // +   improved by: Steven Levithan (http://blog.stevenlevithan.com)
  // +    tweaked by: Jack
  // +   bugfixed by: Onno Marsman
  // *     example 1: trim('    Kevin van Zonneveld    ');
  // *     returns 1: 'Kevin van Zonneveld'
  // *     example 2: trim('Hello World', 'Hdle');
  // *     returns 2: 'o Wor'
  // *     example 3: trim(16, 1);
  // *     returns 3: 6
  var whitespace, l = 0,
    i = 0;
  str += '';

  if (!charlist) {
    // default list
    whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
  } else {
    // preg_quote custom list
    charlist += '';
    whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
  }

  l = str.length;
  for (i = 0; i < l; i++) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(i);
      break;
    }
  }

  l = str.length;
  for (i = l - 1; i >= 0; i--) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(0, i + 1);
      break;
    }
  }

  return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}