
function enviarDatos(){
    let codigo = document.getElementById('codigo').value;
    let huella = document.getElementById('huella').value;
    let tarjeta = document.getElementById('tarjeta').value;
    let facial = document.getElementById('facil').value;
    $.ajax({
        url     :'idk.php',
        type    :'post',
        dataType:'text',
        data    :'cal='+cal,
        success  :function(res){//MAS BIEN TRATA SOBRE QUE SALIO BIEN LA CONEXION
            if(res==1){
                $('#mensaje').html('Aprobaste');
            }else{
                $('#mensaje').html('Reprobaste');
            }
            setTimeout("$('mensaje').html('');",8000);

            //ENCONTRO EL ARCHIVO Y PUEDE LEER UNA POSIBLE RESPUESTA
            //QUE FUE enviada desde el archivo
        }, error: function(){
            alert('error archivo no encontrado');
        }
    })
    


}