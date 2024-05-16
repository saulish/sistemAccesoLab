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
  function hacerCheck(){


    let huella = document.getElementById('huella').value;
    let tarjeta = document.getElementById('tarjeta').value;
    let facial = document.getElementById('facial').value;


    if(huella=="" && tarjeta=="" && facial==""){
      alert("Debe seleccionar al menos un metodo de autenticacion");
    return;
    }
    $.ajax({
        url:'funciones/check.php',
        type: 'POST',
        dataType: 'text',
        data: 
        '&huella=' + huella + '&tarjeta=' + tarjeta + '&facial=' + facial,
        
        success: function(res) {
          alert(res);
  
        },
        error: function() {
          alert('Error: archivo no encontrado');
        }
      });
  
  }