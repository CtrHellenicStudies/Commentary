<?php


///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
function un_dimanche($ts) {
  $date=date('N',$ts);
  return($date==7);
}
///////////////////////////////////////////////////////////////////////////
function en_vacances($ts) {
  $date=date('Y-m-d',$ts);
  return( (($date<PHASE1DEB) || (($date>FEVDEB)&&($date<FEVFIN)) || (($date>PAQDEB)&&($date<PAQFIN)) || ($date>PHASE3FIN)) );
}
///////////////////////////////////////////////////////////////////////////
function mois_calendrier($mois,$infos) {
  $les_mois = array("","Janvier","Février","Mars","Avril","Mai","Juin"
		    ,"Juillet","Août","Septembre","Octobre","Novembre","Décembre");
  $les_jours = array("Lun","Mar","Mer","Jeu","Ven","Sam","Dim");


  $letableau="\n<center>";
  $letableau.="\n<table class=\"table\">";
  $letableau.="\n<tr>"
    ."\n\t<th><a class=\"image\" href=\"qualifications_reservations.php?quoi=".$_GET["quoi"]."&mois=".($mois-1)."\"><img style=\"none\" src=\"images/backward.png\" /></a></th>"
    ."\n\t<th colspan=5 align=center>".$les_mois[$mois]." ".ANNEE."</th>"
    ."\n\t<th><a class=\"image\" href=\"qualifications_reservations.php?quoi=".$_GET["quoi"]."&mois=".($mois+1)."\"><img style=\"none\" src=\"images/forward.png\" /></a></th>"
    ."\n</tr>";
  $letableau.="\n<tr>";
  foreach ($les_jours as $valeur)
    $letableau.="\n\t<td align=center><b>$valeur</b></td>";
  $letableau.="\n</tr>";

  $jourdebut=mktime(1, 0, 0, $mois,1, ANNEE);

  $getdate=getdate($jourdebut);
  $jourdebut=$getdate["wday"];//0 pour le dimanche
  $decalage=($jourdebut+6)%7;
  $jourfin=mktime(1, 0, 0, ($mois+1),0, ANNEE);

  $getdate=getdate($jourfin);
  $nbjours=$getdate["mday"];
  $letableau.="\n<tr>";
  for ($i=0;$i<$decalage;$i++)
    $letableau.="\n<td style=\"background-color:#656565;\">&nbsp;</td>";
  $aaaamm=ANNEE;
  if (strlen($mois)==1)
    $aaaamm.="0";
  $aaaamm.=$mois;
  for ($i=1;$i<=$nbjours;$i++) {

    $ts=mktime(0,0,0,$mois,$i,ANNEE);
    //    echo $ts." ".timestamp2txt($ts,"jjma")."<br />";
    
    if ((($i+$decalage-1)%7)==0)
      $letableau.="\n</tr>\n<tr>";
    if (isset($infos[$ts])) {
      $linfo="";
      $couleur="";
      foreach (array("R"=>"ROUGE","O"=>"ORANGE","V"=>"VERT") as $c=>$coul)
	if ((isset($infos[$ts])) and ($infos[$ts][$c]["nb"]!=0)) {
	  $linfo.="\n<span class=\"tooltip-container\"><font style=\"font-size:10px;color:black;\">".$infos[$ts][$c]["nb"]."\n</font>"
	    ."\n<span class=\"tooltip tooltip-".$c."\" align=left><ul>".$infos[$ts][$c]["txt"]."\n</ul></span>"
	    ."\n</span>";
	  $couleur.=$coul."_";
	}
      $couleur=chaine_moins($couleur,1);
      
      $lacouleur="style=\"background-image:url(images/".$couleur.".png);\"";
      $letableau.="\n<td $lacouleur align=center>"; //$lacouleur 
      $letableau.="\n<a class=\"image\" href=\"qualifications_reservations.php?souhait_timestamp=".$ts."&quoi=".$_GET["quoi"]."\" "
	." ><font style=\"color:black;\">".$i."</font>";//class=\"tooltip-container\"  
      // //$letableau.="\n<div align=center>".amj2jma_longue($ts)."</div><br />";
      // $letableau.="\n<b>".amj2jma_longue($ts)."</b><br />";
      // if (isset($infos[$ts]['attrib_def_details']))
      // 	$letableau.="\n<div align=left style=\"background-color:".VERT.";\">".$infos[$ts]['attrib_def_details']."</div>";
      // // if (isset($infos[$ts]['attrib_def_details']))
      // //   $letableau.="\n <div style=\"background-color:".VERT.";\">".$infos[$ts]['attrib_def_details']."</div>";
      // if (isset($infos[$ts]['attrib_date_details']))
      // 	$letableau.="\n<div align=left style=\"background-color:".ORANGE.";\">".$infos[$ts]['attrib_date_details']."</div>";
      // if (isset($infos[$ts]['souhait_date_details']))
      // 	$letableau.="\n<div align=left style=\"background-color:".ROUGE.";\"> ".$infos[$ts]['souhait_date_details']."</div>";
      // // //<a href=\"JourReservation.php?date=$ts&Admin=Admin\">toto</a>
      $letableau.="\n</a>";
      $letableau.="\n<hr>";
      $letableau.=$linfo;
     

      $letableau.="</td>";
    }
    else {
      $letableau.="\n<td align=center ";//>$i";
      if (en_vacances($ts))
	$letableau.="style=\"background-color:#656565;\" ";
      $letableau.=">$i";
      $letableau.="\n<hr>";
      $letableau.="\n&nbsp;</td>";
    }
  }
  for ($i=0;$i<((7-(($nbjours+$decalage)%7))%7);$i++)
    $letableau.="\n<td  style=\"background-color:#656565;\"> &nbsp; </td>";
  $letableau.="\n</table>";
  $letableau.="\n</center>";
  return($letableau);
}
///////////////////////////////////////////////////////////////////////////
function ts_entre_ts($debut, $fin) {
  //Retourne un tableau contenant tous les timestamps des jours entre deux timestamps
  //$start et $end sont des timestamps à O0h00m00s
  $retour = array();
  $courant = $debut;
  while ($courant!=$fin) {
    //echo timestamp2txt($courant,"jjmahms")."<br />";
    $retour[]=$courant;
    $courant=$courant+(24*60*60);
  }
  return($retour);
  }
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////


$tabjour = array('Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi','Vendredi','Samedi');
$tabmois = array('','janvier', 'février', 'mars', 'avril', 'mai', 'juin','juillet', 'août', 'septembre', 'octobre', 'novembre','décembre');

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////
function jma2amj($date,$sep="-") {
  return(substr($date,6,4).$sep.substr($date,3,2).$sep.substr($date,0,2));
}
////////////////////////////////////////////
function amj2jma_longue($date) {
  global $tabjour,$tabmois;
  $datetemp=mktime(0, 0, 0, substr($date,4,2), substr($date,6,2), substr($date,0,4));
  
  $datefr = $tabjour[date("w",$datetemp)]." ".date("d",$datetemp)." ".strtolower($tabmois[date("n",$datetemp)])." ".date("Y",$datetemp);
  return($datefr);
}
///////////////////////////////////////////////////////////////////////////
function sqltimestamp2txt($timestamp,$modele) {
  $ts=str_replace(":","",$timestamp);
  $ts=str_replace(" ","",$ts);
  $ts=str_replace("-","",$ts);
  //    echo $ts."\n";
  return(timestamp2txt(strtotime($ts),$modele));
}
///////////////////////////////////////////////////////////////////////////
function timestamp2txt($timestamp,$modele) {
  global $tabjour,$tabmois;
  $jsem = date('w', $timestamp);
  $jmois = date('j', $timestamp);
  $mois = date('n', $timestamp);
  $annee = date('Y', $timestamp);
  $heures = date('G', $timestamp);
  $minutes = date('i', $timestamp);
  $secondes = date('s', $timestamp);
  switch($modele){
  case "jj/mm/aaaa":
    return (sprintf("%02d",$jmois)."/".sprintf("%02d",$mois)."/".$annee);
    break;
  case "jj-mm-aaaa":
    return (sprintf("%02d",$jmois)."-".sprintf("%02d",$mois)."-".$annee);
    break;
  case "aaaa-mm-jj hh:mm:ss":
    return ($annee."-".sprintf("%02d",$mois)."-".sprintf("%02d",$jmois)." ".$heures.":".$minutes.":".$secondes);
    break;
  case "jjma":
    return ($tabjour[$jsem]." ".$jmois." ".$tabmois[($mois)]." ".$annee);
    break;
  case "jjm":
    return ($tabjour[$jsem]." ".$jmois." ".$tabmois[($mois)]);
    break;
  case "jm":
    return ($jmois." ".$tabmois[($mois)]);
    break;
  case "jjmahms":
    return ($tabjour[$jsem]." ".$jmois." ".$tabmois[($mois)]." ".$annee.
	    " &agrave; ".$heures.":".$minutes.":".$secondes);
    break;
  case "amjjhms":
    return (date('l', $timestamp).", ".date('d', $timestamp).date('S', $timestamp)." ".date('F', $timestamp)." ".$annee.
	    " at ".$heures.":".$minutes.":".$secondes);
    break;
  }
}
///////////////////////////////////////////////////////////////////////////


?>