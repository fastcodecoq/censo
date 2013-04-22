var socket = false;
var ls = window.localStorage;
var it_sinc = 0;
var count = 1;
var carga = false;
var sck_cnn = false;
var total = 0;
var db;


      function listHash(){

           if(carga)
             return false;


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

                          showCar();

                            switch(tipo){

                                case "local":


                                       var call_ok = function( imgData ){

                                      
                                        alert("imagen obtenida");


                                           var file_ok = function(entry){

                                            
                                             alert(entry.name);

                                               var cop_ok = function(entry){

                                                  alert(entry.fullPath);
                                              
                                                  $("input[name='local']").val( entry.fullPath );
                                                  quitCar();      

                                                  }


                                               var cop_error = function(){

                                                   alert("No se pudo copiar la imagen");
                                                   quitCar();

                                                  }


                                              copFile(entry, cop_ok, cop_error);


                                             }

                                             var file_error = function(){

                                                 alert("Error obteniendo archivo");
                                                 quitCar();

                                             }

                                           
                                      try{

                                           window.resolveLocalFileSystemURI(imgData, file_ok, file_error);

                                         }
                                         catch(e){

                                            alert("error resolviendo el URI del archivo");

                                         }
                                            

                                                                                                                                  

                                       };


                                       var call_error = function(){

                                          alert("no se ha podido obtener la imagen");
                                           quitCar();

                                       };




                                       tomarFoto(call_ok, call_error);


                                break;


                                case "recibo":

                                    var call_ok = function( imgData){

                                            $("input[name='recibo']").val( "data:image/jpeg;base64," + imgData.toString()  );
                                             quitCar();

                                            alert("La imagen se ha obtenido con exito");

                                       };



                                       var call_error = function(){

                                          alert("no se ha podido obtener la imagen");
                                           quitCar();

                                       };


                                       tomarFoto( call_ok, call_error);

                                break;


                            }

                    break;


                    case "cargar":

                    try{

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
                         quitCar();
                         return;

                       }

                  
                  showCar();


                 usuario = obt_vars();              
                            
                 salvarLS(usuario, function(){ alert("Guardado localmente"); quitCar(); });

                      }
                      catch(e){

                          alert("error");
                          quitCar();

                      }


                    break;


                    case "sincronizar":                        

                        showCar();
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



                if( !checkConnection() )
                    {

                       alert("Para sincronizar debes tener cobertura");
                       quitCar();
                       return false;

                    }else{

                        conectarServer();

                    }

                if(!sck_cnn)
                {

                   alert("No ha sido posible conectar al servidor");
                   return false;

                }


               if(!info.length > 0){
                
                  alert("No hay datos locales para sincronizar");
                  quitCar();
                  return false;

                }



              $(".sincro_total").text(info.length);
              $(".sincro").css({display:"block"});
              total = info.length;

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
               local : $("form#add_usuario input[name='local']").val(),
               obs : $("form#add_usuario input[name='obs']").val()

            }


            console.log(usuario);

            return usuario;

      }


      function nivel_camb(){

          $("#nivel_ button").click(function(){ 


                $("input[name='nivel']").val( $(this).attr("rel") );

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





      function controlFoto()
      {


document.querySelector("#recibo").addEventListener('change', function(e){
  
var archivo = document.querySelector('#recibo').files[0],
    reader = new FileReader(),
    urlBase64;
  
    console.log(archivo)

  reader.onload = function(){
    urlBase64 = reader.result;
    
      $("body").append("<img src='"+urlBase64+"' alt='' />");

  };

  reader.readAsDataURL(archivo);

},false);

}



      //eventos camara


       var pictureSource;   // Origen de la imagen
       var destinationType; // Formato del valor retornado
       var entry;

    // Espera a que PhoneGap conecte con el dispositivo.
    //
      document.addEventListener("deviceready",onDeviceReady,false);

    // PhoneGap esta listo para usarse!
    //
       function onDeviceReady() {

          pictureSource=navigator.camera.PictureSourceType;
          destinationType=navigator.camera.DestinationType;

          function fil_ok(){

             console.log("ok")

          }

          
         try{
          
             window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fil_ok, null);
           
           }
           catch(e)
           {

            alert("error obteniendo sistema de archivos local");

           }

           ini();

        }


        //copiar un archivo a una carpeta


        function copFile(entry, file_ok, file_error, dir) {

      
      try{

        var parent = (!dir) ? "file:///censo/fotos" : dir,
        parentName = parent.substring(parent.lastIndexOf('/')+1),
        parentEntry = new DirectoryEntry(parentName, parent);

        alert(parent);
       
        entry.copyTo(parentEntry, entry.name, file_ok, file_error);


         }
         catch(e){

           alert("error copiando archivo");

         }

        
        }


        

        //-------------------------------//


        function tomarFoto(call_ok , call_error) {
           
              navigator.camera.getPicture( call_ok , call_error , { quality: 50  } );

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
              actSinc(its.length);
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
           total = 0;        

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
       
        var lss = obtLS();
        console.log(lss);

              actSinc(lss.length);

   
      }




      function actSinc(cant){

         $("a[href='#sincronizar']").html("Sincronizar("+cant+") <i class='icon icon-refresh'></i>");

      }


      function showCar(){

          $(".cargando").css({display: "block"});
          carga = true;

      }


      function quitCar(){

         $(".cargando").css({display: "none"});
         carga = false;

      }

      function desconectarServer(){

          socket = false;
          $("head script[src='http://apmontelibano.com:8888/socket.io/socket.io.js']").remove();

      }
    
     function conectarServer(){     

          var script = '<script src="http://apmontelibano.com:8888/socket.io/socket.io.js"></script>';     

          $("head").append(script);

           var c = setInterval(function(){
              
               socket = io.connect('http://apmontelibano.com:8888',{ timeout : 60000 });
               ons();
                     
               console.log("1");

              window.clearInterval(c);

            },1000);  

      }



      function ons(){

        
        if(socket)
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
                         quitCar();

                       }

                       var prog = total - count;

                       actSinc( prog );
                       $(".sincro_prog").text( prog );

                       count++;

                    break;


                   }
                   

                  }
                  else
                    alert("No guardado, intenta de nuevo");


                             quitCar();

          });


        socket.on("disconnect",function(){

             sck_cnn = false;
             console.log(sck_cnn);
             alert("Sin conexión de datos. Los datos se almacenarán localmente");

        });


        socket.on('connect', function () {

             sck_cnn = true;
             console.log(sck_cnn);

        });


        socket.on('reconnect', function () {

              sck_cnn = true;
              console.log(sck_cnn);

        });




      }


      function ini(){
                          

        if(checkConnection()){
          
           conectarServer(); 
           listHash(); 
           nivel_camb();
           iniLS();           


        }else{


           alert("Sin cobertura, todo se almacenará local");    
           listHash(); 
           nivel_camb();
           iniLS();      

         }

                    
         
          
       }




      function _ini(){
                          

          
           listHash(); 
           nivel_camb();
           iniLS();    

           console.log("APmontelibano: Sistema iniciado");  
                 
         
          
       }

       





       $(document).ready(function(){


          //_ini();
                
             

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


