<?php
function conecta(){
    $con =new mysqli (HOST, USER_BD, PASS_BD, BD);
    return $con;
}

?>