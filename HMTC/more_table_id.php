<?php

/////////////////////////////////////////////////////////////////////////////////////////////
require_once("outils.php");
/////////////////////////////////////////////////////////////////////////////////////////////
$head="";
echo hautdepage("Admin-Accueil",$head);
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
echo "<script type=\"text/javascript\" src=\"js/wz_tooltip.js\"></script>
<script type=\"text/javascript\" src=\"js/tip_balloon.js\"></script>
<script type=\"text/javascript\" src=\"js/tip_centerwindow.js\"></script>
";



function Reduire_Chaine($string, $word_limit, $lien)
{
  $string=strip_tags($string);
  $words = explode(" ", $string, ($word_limit + 1));
  if(count($words) > $word_limit){
    array_pop($words);
    $fin=" <a href=\"".$lien."\">[more]</a>";
  }else
    $fin="";
  return implode(" ", $words).$fin;
}


$short="\n<br />";
if (isset($_GET["id_writer"])) {
  if ($_GET["id_writer"]==0) 
    $short.="\n<a href=\"admin.php\">All writers</a>";
  $elt=trouve_champs("writers",array("lastname","firstname"),$_GET["id_writer"],$mysqli);
  $short.="\n<a href=\"admin.php?id_writer=".$_GET["id_writer"]."\">".$elt["lastname"]." ".$elt["firstname"]."</a>";
}
if (isset($_GET["id_author"])) {
  $elt=trouve_champs("authors",array("lastname","firstname"),$_GET["id_author"],$mysqli);
  $short.="\n - <a href=\"admin.php?id_writer=".$_GET["id_writer"]."&id_author=".$_GET["id_author"]."\">".$elt["lastname"]." ".$elt["firstname"]."</a>";
}
if (isset($_GET["id_work"])) {
  $short.=" >> \n<a href=\"admin.php?id_writer=".$_GET["id_writer"]."&id_author=".$_GET["id_author"]."&id_work=".$_GET["id_work"]."\">".trouve_champs("works",array("title"),$_GET["id_work"],$mysqli)."</a>";
}

echo $short;      

echo "\n<br /><br />";

require_once("table_".$_GET["table"].".php");


echo more_id($_GET["id"],$mysqli);

/////////////////////////////////////////////////////////////////////////////////////////////
echo basdepage();
require_once("deconnexion.php");
/////////////////////////////////////////////////////////////////////////////////////////////
?>
