<?php

///////////////////////////////////////////////////////////////////////////
function prepare_champs($champs) {
  $leschamps="";
  foreach($champs as $champ)
    if (strstr($champ,"timestamp"))
      $leschamps.="UNIX_TIMESTAMP(".$champ.") as ".$champ.",";
    else
      $leschamps.=$champ.",";
  return(chaine_moins($leschamps,1));  
}
///////////////////////////////////////////////////////////////////////////
function affiche_la_table($table,$details,$select,$bd)
{
  $identifiant="id_".chaine_moins($table,1);
  $query="SELECT ".prepare_champs($details["champs"])." FROM ".BDD_PREFIXE."".$table." ".$select."";
  //echo "affiche_table pour $table : $query<br /><br />";
  $result=$bd->query($query);
  
  $texte="\n<br />";

  $texte.="\n<h1>$table</h1>";
  $texte.="\n<div align=right>";
  $texte.="\n<a href=\"table.php?prefixetable=".strstr($table,"_",true)."&table=".$table."&quoi=modification\">Ajouter un enregistrement</a>";
  $texte.="\n</div><br />";
  $texte.="\n<center><table class=\"table\">";
  $texte.="\n<thead><tr><th></th>";
  $texte.=call_user_func("affiche_table_".$table."_th",Array());
  $texte.="\n<th></th></tr></thead>";
  while ($element = $result->fetch_object()) 
    {
      $texte.="\n<tr>";
      
      $texte.="\n<td>";
      $elt=trouve_champs("site_users",Array("firstname","lastname"),$element->maj_id_site_user,$bd);
      ///////////////////////////////////////////////////////////      if ($_SESSION["id_site_accreditation"]==1)
      $texte.="\n<a href=\"table.php?prefixetable=".strstr($table,"_",true)."&table=$table&quoi=modification&id="
	.$element->{$identifiant}."\" class=\"image\" title=\"";
      if (isset($element->depot_timestamp))
	$texte.="Déposé le ".timestamp2txt($element->depot_timestamp,"jjmahms")."\n";
      $texte.="Mise à jour le ".timestamp2txt($element->maj_timestamp,"jjmahms")." par ".$elt["firstname"];
      $texte.="\"><img src=\"images/Edit.png\"></a>";
      // $texte.="\n<img src=\"images/Refresh.png\" title=\"";
      // $texte.="Mise à jour le ".timestamp2txt($element->maj_timestamp,"jjmahms")." par ".$elt["prenom"];
      // $texte.="\" />";
	// $texte.="\n<a href=\"etats.php?choix=$table&identifiant="
	//   .$element->{$identifiant}."\" class=\"image\"><img src=\"images/Search.png\"></a>";
	$texte.="</td>";
      $texte.=call_user_func_array("affiche_table_".$table."_tds",Array($element,$bd));

      $texte.="\n<td>";
      
      $texte.="\n<a href=\"table.php?table=$table&quoi=suppression&id="
      	.$element->{$identifiant}."\" class=\"image\" onCLick=\"return confirm('Voulez-vous définitivement effacer cet enregistrement ?')\"><img src=\"images/Delete.png\"></a></td>";
      $texte.="</tr>";
    }
  
  $texte.="\n</table><br /></center>";


  if ($_SESSION["id_site_accreditation"]==10){
    $texte.="\n<div align=right>";
    $texte.="\n<a href=\"table.php?prefixetable=".strstr($table,"_",true)."&table=".$_GET["table"]."&quoi=modification\">Ajouter un enregistrement</a>";
    $texte.="\n</div>";
  }
  $texte.="\n<br />";
  return($texte);
}
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
function affiche_l_entite($table,$details,$identifiant,$bd)
{
  $champs=$details["champs"];
  $hidden="";
  //Exceptions : table sources
  if (isset($_GET["id_tableofcontent"]))
    $hidden.="\n<input type=\"hidden\" name=\"id_tableofcontent\" value=\"".$_GET["id_tableofcontent"]."\" >";

  if (isset($_GET["jeviensde"]))
    $hidden.="\n<input type=\"hidden\" name=\"jeviensde\" value=\"".$_GET["jeviensde"]."\" >";
  else
    $hidden.="\n<input type=\"hidden\" name=\"jeviensde\" value=\"".$_SERVER['HTTP_REFERER']."\" >";
    
  if ($identifiant!="")
    {
      $leschamps="";
      foreach($champs as $champ)
	if (strstr($champ,"timestamp"))
	  $leschamps.="UNIX_TIMESTAMP(".$champ.") as ".$champ.",";
	else
	  $leschamps.=$champ.",";
      $leschamps=chaine_moins($leschamps,1);
      
      $query="SELECT ".$leschamps." FROM ".BDD_PREFIXE."$table WHERE id_".chaine_moins($table,1).
	"=$identifiant";
      //echo "<font color=red>".$query."</font><br />";
      $result=$bd->query($query);
      $element = $result->fetch_object();
      $postaction="UPDATE";
      $bouton="Update";
      $hidden.="\n<input type=\"hidden\" name=\"id_".chaine_moins($table,1)."\" value=\"".$identifiant."\">";
      $maj="\n<tr><th colspan=2 align=center>Updated on ".
	timestamp2txt($element->maj_timestamp,"amjjhms");
      //$maj.="\n&nbsp;&nbsp;<a href=\"table.php?table=$table&quoi=suppression&id="
      //	.$identifiant."\"><img align=top src=\"images/delete.png\"></a>";
	$maj.="\n</th></tr>";
    }
  else
    {
      $postaction="INSERT";
      $bouton="Insert";
      //      print_r($details);
      $maj="\n<tr><th colspan=2 align=center>".$details["nouveau"]."</th></tr>";
      $element=new stdClass();
      foreach($champs as $champ)
	$element->$champ="";
    }
  //  $maj.="\n<tr><td colspan=2>&nbsp;</td></tr>".
  

  $texte="";
  // onSubmit=\"return check()\" 
  $texte.="\n<form name=\"form_table_ligne\" action=\"".$_SERVER['REQUEST_URI']."\" method=\"POST\" enctype=\"multipart/form-data\">";
  $texte.="\n<input type=\"hidden\" name=\"postaction\" value=\"$postaction\">"; 
  $texte.=$hidden;
  $texte.="\n<br />\n<center><table class=\"table\">";
  $texte.=$maj;  

  $texte.=call_user_func("affiche_formulaire_".$table,$element,$bd);
      
  $texte.="\n</table>";
  $texte.="\n<br /><input type=\"submit\" name=\"submit\" value=\"$bouton\">";
  $texte.="\n</center>";
  $texte.="\n</form>";

  if ($_SESSION["id_site_accreditation"]==10){
    $texte.="\n<div align=right>";
    $texte.="\n<a href=\"table.php?prefixetable=".strstr($table,"_",true)."&table=".$_GET["table"]."&quoi=modification\">Add a new record</a>";
    $texte.="\n</div>";
  }
  $texte.="\n<br />";
  return($texte);
}
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////




?>
