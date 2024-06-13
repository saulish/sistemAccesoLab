let port;
//FUNCIONES PARA HACER EL CHECK
function actualizarDatos() {
    let codigo = document.getElementById('codigo').value;
    let huella = document.getElementById('huella').value;
    let tarjeta = document.getElementById('tarjeta').value;
    //let facial = document.getElementById('facial').value;
    $.ajax({
      url:'funciones/updateDatos.php',
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

function enviarDatos() {
    let codigo = document.getElementById('codigo').value;
    let huella = document.getElementById('huella').value;
    let tarjeta = document.getElementById('tarjeta').value;
    let elementoF = document.getElementById('facialV');
    
    const facial=elementoF.getAttribute('value');
    $.ajax({
      url:'funciones/setDatosBio.php',
      type: 'POST',
      dataType: 'text',
      data: 
      'codigo=' + codigo + '&huella=' + huella + '&tarjeta=' + tarjeta + '&facial=' + facial,
      
      success: function(res) {
        const estado=document.getElementById('modelStatus');
        estado.innerText = res;
        setTimeout(() => {
            estado.innerText = '';
        }, 3000); // 3000 milisegundos = 3 segundos
      },
      error: function() {
          alert('Error: archivo no encontrado');
      }
    });
  }



//Check
function hacerCheck() {
    let codigo = document.getElementById('codigo').value;
    let huella = document.getElementById('huella').value;
    let tarjeta = document.getElementById('tarjeta').value;
    //let facial = document.getElementById('facial').value;
    const facial=null

    $.ajax({
        url: 'funciones/check.php',
        type: 'POST',
        dataType: 'text',
        data: {
            codigo: codigo,
            huella: huella,
            tarjeta: tarjeta,
            facial: facial
        },
        success: function(resultado) {
            enviarComandoAlArduino(resultado);
        },
        error: function() {
            alert('Error: no se pudo conectar con el servidor');
        }
    });
}
  
function enviarComandoAlArduino(resultado) {
    if (port && port.writable) {
        const writer = port.writable.getWriter();
        writer.write(new TextEncoder().encode(resultado));
        writer.releaseLock();
    } else {
        alert('No hay conexión al puerto serial.');
    }
}

function hacerCheckRecibir(codigo,huella,tarjeta,facial){
  if (codigo == "" && huella == "" && tarjeta == "" && facial == ""){
      
      alert("Debe seleccionar al menos un metodo de autenticacion");
      return;
    }

    $.ajax({
        url:'funciones/check.php',
        type: 'POST',
        dataType: 'text',
        data: 
         'codigo=' + codigo +'&huella=' + huella + '&tarjeta=' + tarjeta + '&facial=' + facial,
        
        success: function(res) {
          const partes = res.split(",");

          // Asignar las partes a las variables
          const codigoRes = partes[0].trim();
          const nombre = partes[1].trim();
          switch (codigoRes) {
            case '0':
              alert('Bienvenido '+nombre);
              break;
            case '1':
              alert('Datos incorrectos ');
              break;
            case '4':
              alert('Adios '+nombre);
              break;
            case '2':
              alert('Error '+nombre);
              break;
          }

  
        },
        error: function() {
          alert('Error: archivo no encontrado');
        }
      });
  
  }



