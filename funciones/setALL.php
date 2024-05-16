<?php
define ("HOST",'Localhost');
define("BD",'sistemaaccesolab');
define("USER_BD",'root');
define("PASS_BD",'');

function conecta(){
    $con =new mysqli (HOST, USER_BD, PASS_BD, BD);
    return $con;
}


$conexion = conecta();

if($conexion->connect_error){
    die("Error de conexión: " . $conexion->connect_error);
    echo 0;
}


$nombre='Saul';
$codigo=$_POST['codigo'];
$telefono=3331746727;


$huella=$_POST['huella'];
$facil=$_POST['facial'];
$tarjeta=$_POST['tarjeta'];


$sql="INSERT INTO usuarios (codigo, telefono, nombre) VALUES ($codigo, $telefono, '$nombre')";
$sqDatos="INSERT INTO datos_biometricos (codigo, Dhuella, Dfacial, Dtarjeta) VALUES ($codigo, '$huella', '$facil', '$tarjeta')";


$resuser = $conexion->query($sql);
if($resuser){
    $resBio = $conexion->query($sqDatos);
    if($resBio){
        echo "Datos insertados correctamente";
    }

}else{
    echo "Error al insertar datos";
}



?>