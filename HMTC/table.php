<?php
/////////////////////////////////////////////////////////////////////////////////////////////
require_once("outils.php");
/////////////////////////////////////////////////////////////////////////////////////////////
if (isset($_GET['prefixetable'])) {
  if ((isset($_SESSION["hautdepage"])) and ($_GET["prefixetable"]!="finale"))
    unset($_SESSION["hautdepage"]);
 }
/////////////////////////////////////////////////////////////////////////////////////////////
if (isset($_GET['table'])){
  require_once ("table_".$_GET['table'].".php");
 }
/////////////////////////////////////////////////////////////////////////////////////////////
//Mises à jour - Suppression
/////////////////////////////////////////////////////////////////////////////////////////////
if ((isset($_GET['quoi'])) and ($_GET['quoi']=="suppression")){
    //echo "suppression ";
    $query="DELETE FROM ".BDD_PREFIXE.$_GET['table']." WHERE id_".chaine_moins($_GET['table'],1)."='".$_GET['id']."'";
    //echo "<b>Query : ".$query."</b><br />";
    $result=$mysqli->query($query);
    header('Location: '.$_SERVER['HTTP_REFERER']); 
  }
/////////////////////////////////////////////////////////////////////////////////////////////
//Mises à jour - Modification
/////////////////////////////////////////////////////////////////////////////////////////////
if ((isset($_GET['quoi'])) and ($_GET['quoi']=="modification") and (isset($_POST['postaction']))){
  $query=$_POST['postaction']." ".BDD_PREFIXE.$_GET['table']." SET ";
  //  echo "\n<pre>".print_r($table_details["champs"])."</pre>";
  foreach($table_details["champs"] as $champ){
    //echo "-->$champ<br />";
    switch($champ) {
    case "depot_timestamp" :
      if ($_POST['postaction']=="INSERT")
	$query.=$champ."=NOW(), ";
      else
	$query.=$champ."='".$_POST[$champ]."', ";
      break;
    case "maj_timestamp" :
      $query.=$champ."=NOW(), ";
      break;
    case "comment" :
      $query.=$champ."='".$mysqli->real_escape_string($_POST[$champ])."', ";//addslashes(utf8_encode($_POST[$champ]))."', ";
      break;
    case "maj_id_site_user" :
      $query.=$champ."='".$_SESSION["id_site_user"]."', ";
      break;
    case "alea" :
      if ($_POST['postaction']=="INSERT")
	$query.=$champ."='".chaine_alea(32,"hexa")."', ";
      else
	$query.=$champ."='".$_POST[$champ]."', ";
      break;
    case "fichier" :
      //$_FILES['icone']['name']     
      //Le nom original du fichier, comme sur le disque du visiteur, (exemple: mon_icone.png).
      //$_FILES['icone']['type']     
      //Le type du fichier. Par exemple, cela peut être "image/png"
      //$_FILES['icone']['size']     
      //La taille du fichier en octets
      //$_FILES['icone']['tmp_name'] 
      //L'adresse vers le fichier uploadé dans le répertoire temporaire
      //$_FILES['icone']['error']    
      //Le code d'erreur, qui permet de savoir si le fichier a bien été uploadé
      if ($_POST[$champ]!="")
	$query.="$champ='".addslashes($_POST[$champ])."', ";
      else{
	$query.="$champ='".$_FILES['fichier']['name']."', ";
	$transfert = move_uploaded_file($_FILES['fichier']['tmp_name'],
					"upload/".$_FILES['fichier']['name']);
	if ($transfert) echo "Transfert réussi";
	exec("convert -geometry 60x60 upload/".$_FILES['fichier']['name']." upload/miniatures/".$_FILES['fichier']['name']."");
      }
      break;
    default :
      if (strstr($champ,"timestamp")) {
	  if (!(strstr($_POST[$champ],"jj"))) 
	    $query.="$champ='".timestamp2txt(strtotime(jma2amj($_POST[$champ],"/")),"aaaa-mm-jj hh:mm:ss")."', ";
      }
      else
	if ($champ!="id_".chaine_moins($_GET['table'],1)){
	  $query.="$champ='".(addslashes($_POST[$champ]))."', ";
	  //echo "\n $champ = ".$_POST[$champ]."<br />";
	}
      
    }
  }  
  $query=chaine_moins($query,2);
  if ($_POST['postaction']=="UPDATE")
    $query.=" WHERE id_".chaine_moins($_GET['table'],1)."='".
      $_POST["id_".chaine_moins($_GET['table'],1)]."'";
  




  //  echo  hautdepage("Admin-Accueil");//$_SESSION["hautdepage"]);
  //  echo "<b>Query : ".$query."</b><br />";

  //  echo htmlentities($query, ENT_QUOTES, "UTF-8")."<br />";
  //  echo htmlentities($_POST["comment"], ENT_QUOTES, "UTF-8")."<br />";
  //  echo $_POST["comment"]."<br />";
  //  exit();
  //echo $_POST["jeviensde"];



 
  $result=$mysqli->query($query);
  //  echo $query;
  //  exit;

  header('Location: '.$_POST["jeviensde"]); 
 }

/////////////////////////////////////////////////////////////////////////////////////////////
if (isset($_SESSION["hautdepage"]))
  echo hautdepage($_SESSION["hautdepage"]);
else
  echo hautdepage("Admin-Tables");
/////////////////////////////////////////////////////////////////////////////////////////////
if (isset($_GET["table"])){
  $jeviensde=$_SERVER['HTTP_REFERER'];
  
  $affiche="";
    
  if ($_GET['quoi']=="contenu")
    $affiche.=affiche_la_table($_GET['table'],$table_details,$table_details["select"][$_GET['detail']],$mysqli);
  
  
  if ($_GET['quoi']=="modification")
    if (isset($_GET['id']))
      $affiche.=affiche_l_entite($_GET['table'],$table_details,
				 $_GET['id'],$mysqli);
    else
      $affiche.=affiche_l_entite($_GET['table'],$table_details,
				 "",$mysqli);
  
  echo $affiche;
  
 }
/////////////////////////////////////////////////////////////////////////////////////////////
echo basdepage();
require_once("deconnexion.php");
/////////////////////////////////////////////////////////////////////////////////////////////

?>
