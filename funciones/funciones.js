function enviarDatos() {
    let codigo = document.getElementById('codigo').value;
    let huella = document.getElementById('huella').value;
    let tarjeta = document.getElementById('tarjeta').value;
    let facial = document.getElementById('facial').value;
  
    $.ajax({
      url:'funciones/setDatosBio.php',
      type: 'POST',
      dataType: 'text',
      data: 
      'codigo=' + codigo + '&huella=' + huella + '&tarjeta=' + tarjeta + '&facial=' + facial,
      
      success: function(res) {
        alert(res);

      },
      error: function() {
        alert('Error: archivo no encontrado');
      }
    });
  }
  