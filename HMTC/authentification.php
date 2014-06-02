<?php

session_start();
//Pour le développement : première authentification
//session_destroy();
//session_start();

////////////////////////////////////
//Ouverture de session pour visiteur
$tmp=explode("/",$_SERVER['SCRIPT_NAME']);
$debutfichier=substr($tmp[count($tmp)-1],0,5);
$debutfichierplus=substr($tmp[count($tmp)-1],0,9);
//echo "debutfichier=".$debutfichier."<br />";
//echo "debutfichierplus=".$debutfichierplus."<br />";

function infos_session($login,$motdepasse){
  global $mysqli;

  //  echo "==========".$login."____________";
  //  echo "==========".$motdepasse."____________";

  
  $login=stripslashes($login);
  if (strlen($motdepasse)!=32)
    $motdepasse=md5(stripslashes($motdepasse));
  
  if ($login=="participant"){
    $sql="SELECT * "
      ."FROM ".BDD_PREFIXE."qualifications_contacts "
      ."WHERE alea='".$motdepasse."'";
    //    echo $sql."<br />";
    $result=$mysqli->query($sql);
    if ($result->num_rows==0) {
      //php 5.4 if(session_status() == PHP_SESSION_ACTIVE)
      if(isset($_SESSION))
	session_destroy();
      header("location:index_erreur.php");
    }
    $row=$result->fetch_object();
    $_SESSION["id_site_user"]="c".$row->id_qualifications_contact;
    $_SESSION["login"]=$login;
    $_SESSION["firstname"]=$row->firstname;
    $_SESSION["lastname"]=$row->lastname;
    $_SESSION["mail"]=$row->mail;
    $sql="SELECT * "
      ."FROM ".BDD_PREFIXE."site_accreditations "
      ."WHERE accreditation='".ucfirst($login)."'";
    $result=$mysqli->query($sql);
    $row=$result->fetch_object();
    $_SESSION["id_site_accreditation"]=$row->id_site_accreditation;
    $_SESSION["accreditation"]=$row->accreditation;
    $authentifie="User : <a href=\"mailto:".$_SESSION["mail"]."\">".$_SESSION["firstname"]." "
      .$_SESSION["lastname"]."</a> (".$row->accreditation.")";
        
    $sql_visite="UPDATE ".BDD_PREFIXE."qualifications_contacts "
      ."SET visite_timestamp=NOW() "
      ."WHERE alea='".$motdepasse."'";
    //echo $sql."<br />";
    $result_visite=$mysqli->query($sql_visite);
    return($authentifie);
  }
  else{
    //Personne avec une accréditation avec login/mot de passe (site_utilisateurs)
    $sql="SELECT su.*, sa.accreditation "
      ."FROM ".BDD_PREFIXE."site_users su, ".BDD_PREFIXE."site_accreditations sa "
      ."WHERE login='".$login."' AND password='".$motdepasse."' "
      ."AND su.id_site_accreditation=sa.id_site_accreditation";
    $result=$mysqli->query($sql);
    if($result->num_rows==1){

      $row=$result->fetch_object();
      $_SESSION["id_site_user"]=$row->id_site_user;
      $_SESSION["login"]=$login;
      $_SESSION["firstname"]=$row->firstname;
      $_SESSION["lastname"]=$row->lastname;
      $_SESSION["mail"]=$row->mail;
      $_SESSION["id_site_accreditation"]=$row->id_site_accreditation;
      $_SESSION["id_site_accreditation_absolue"]=$row->id_site_accreditation;
      $_SESSION["accreditation"]=$row->accreditation;
      $_SESSION["accreditation_absolue"]=$row->accreditation;
      if ($_SESSION["login"]!="visiteur")
	$authentifie="User : <a href=\"mailto:".$row->mail."\">".$row->firstname." "
	  .$row->lastname."</a> (".$row->accreditation.")";
      else
	$authentifie="";
      return($authentifie);
    }
    else
      header("location:logout.php");
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//print_r($_SESSION);
if (!(isset($_SESSION["login"]))){
   if ($debutfichier=="index"){
     if (isset($_GET["alea"]))
       $authentifie=infos_session("participant",$_GET["alea"]);
     else
       if ($debutfichierplus=="index_par")
	 header("location:index_erreur.php");
       else
	 $authentifie=infos_session("visiteur","???");
   }
   else
     if (isset($_POST["login"])){
       $authentifie=infos_session($_POST["login"],$_POST["password"]);
     }
     else
       header("location:login.php");
 }
else
  $authentifie="User : <a href=\"mailto:".$_SESSION["mail"]."\">".$_SESSION["firstname"]." "
    .$_SESSION["lastname"]."</a> (".$_SESSION["accreditation"].")";




?>