<?php
///////////////////////////////////////////////////////////////////////////
//Constantes
require_once ("constantes_site.php");
///////////////////////////////////////////////////////////////////////////
//Connexion
require_once("connexion.php");
///////////////////////////////////////////////////////////////////////////
//Mise en page
require_once ("fonctions_menus.php");
require_once ("misenpage.php");

/////////////////////////////////////////////////////////////////////////////////////////////
echo hautdepage("Authentification-");
/////////////////////////////////////////////////////////////////////////////////////////////

$form="\n<center>";
$form.="\n<form action=\"admin.php\" method=\"POST\" >";
$form.="\n<table class=\"table\">";
$form.="\n<tr><th colspan=2>Authentification</th></tr>";
$form.="\n<tr><td>Login</td><td><input type=\"text\" name=\"login\" value=\"\" size=20></td></tr>";
$form.="\n<tr><td>Password</td><td><input type=\"password\" name=\"password\" value=\"\" size=20></td></tr>";
//$form.="\n<tr><td colspan=2 align=center><input type=\"submit\" name=\"ajout\" value=\"Identification\"></td></tr>";
$form.="\n</table>";
$form.="\n<br /><input type=\"submit\" name=\"ajout\" value=\"Identification\">";
$form.="\n</form>";
$form.="\n</center>";
echo "\n<br>\n".$form."\n<br>";

/////////////////////////////////////////////////////////////////////////////////////////////
echo basdepage();
/////////////////////////////////////////////////////////////////////////////////////////////

?>
