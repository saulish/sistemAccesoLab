<?php
require "conexion.php";


$conexion = conecta();
$codigo = $_REQUEST['codigo'];
$huella = $_REQUEST['huella'];
$tarjeta = $_REQUEST['tarjeta'];
$facial = $_REQUEST['facial'];



$sql="SELECT * FROM usuarios WHERE codigo=$codigo";
$peticionExiste=$conexion->query($sql);
if($peticionExiste->num_rows<1){
    echo "El usuario no existe";



}else{
    $sql="SELECT * FROM datos_biometricos WHERE codigo=$codigo";
    $peticionExiste=$conexion->query($sql);
    if($peticionExiste->num_rows>0){
        echo "El usuario ya tiene datos biometricos";
        return;
    }else{
        $sql="INSERT INTO datos_biometricos (codigo, Dhuella, Dfacial, Dtarjeta) VALUES ($codigo, '$huella', '$facial', '$tarjeta')";
        $resDatos = $conexion->query($sql);
        if($resDatos){
            echo "Datos insertados correctamente";
        }
        else{
            echo "Error al insertar datos";
        }
    }


}





?>