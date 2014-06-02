<?php

$table_details=Array("web"=>"Commentaries",
		     "champs"=>Array("id_commentarie","id_writer","type","comment","URN","textURN","commentURN",
				     "maj_timestamp","maj_id_site_user"),
		     "select"=>Array("defaut" =>" ORDER BY id_commentarie"),
		     "nouveau"=>"New commentary",
		     "options"=>Array()
		     );

function affiche_table_commentaries_th()
{
  return("\n<th>Prénom</th><th>Nom</th><th>Accréditation</th>");
}


function affiche_table_commentaries_tds($element,$bd)
{
  $txt="<td>".$element->firstname."</td>";
  $txt.="<td>".$element->lastname."</td>";
  $elt=trouve_champs("site_accreditations",Array("accreditation"),$element->id_site_accreditation,$bd);
  $txt.="\n<td align=center>".$elt."</td>";
  return($txt);
}


function affiche_formulaire_commentaries($element,$bd)
{
  $texte="";
  $qi="SELECT "
    //    ."w.title AS wotitle, a.lastname AS aulastname, wr.lastname AS wrlastname, wr.firstname AS wrfirstname "
    ." SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(c.textURN,':',-2),':',1),'.',1) AS caurn"
    .", SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(c.textURN,':',-2),':',1),'.',-1) AS cwurn"
    .", SUBSTRING_INDEX(c.textURN,':',-2) AS cacwurn"
    .", CONVERT(SUBSTRING_INDEX(SUBSTRING_INDEX(c.textURN,':',-1),'-',1), SIGNED INTEGER) as nob"
    .", CONVERT(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(c.textURN,':',-1),'-',1),'.',-1), SIGNED INTEGER) as nol  "
    ."FROM commentaries c, authors a, works w, writers wr "
    ."WHERE "
    ."w.urn=\"cwurn\" AND "
    //    ."a.urn LIKE '%:caurn' "
    ."id_commentarie=".$element->id_commentarie."";

  //echo "<br />".$qi."<br />";
  //$ri=$bd->query($qi);
  //$ei = $ri->fetch_object();
  //$texte.="\n<tr><td colspan=2><b>".$ei->aulastname." - ".$ei->wotitle." - ".$ei->wrlastname." - ".$ei->wrlastname." - ".$ei->wrfirstname." - ".$ei->wrlastname." - ".$ei->textURN." - ".$ei->nob." - ".$ei->nol."</b></td></t>";
  
  if ($element->id_commentarie!="") {
    $qi="SELECT * FROM commentaries WHERE id_commentarie=".$element->id_commentarie."";
    //    echo "<br />".$qi."<br />";
    $ri=$bd->query($qi);
    $ei = $ri->fetch_object();
    //  $texte.="\n<tr><td colspan=2><b>".$ei->textURN."</b></td></t>";
    $texte.="\n<tr><td align=right>URN :</td><td><b>".$ei->URN."</b>";
    $texte.="\n<input type=\"hidden\" name=\"id_writer\" value=\"".$element->id_writer."\" />";
    $texte.="\n<input type=\"hidden\" name=\"URN\" value=\"".$ei->URN."\" /></td></tr>";
    $texte.="\n<tr><td align=right>textURN :</td><td><b>".$ei->textURN."</b>";
    $texte.="\n<input type=\"hidden\" name=\"textURN\" value=\"".$ei->textURN."\" /></td></tr>";
    $texte.="\n<tr><td align=right>commentURN :</td><td><b>".$ei->commentURN."</b>";
    $texte.="\n<input type=\"hidden\" name=\"commentURN\" value=\"".$ei->commentURN."\" /></td></tr>";
    $texte.="\n<tr><td align=right> Type :</td>";
    $texte.="\n<td><input type=\"text\" name=\"type\" value=\""
      .$element->type."\" size=30></td></tr>";
    $texte.="\n<tr><td align=right> Comment :</td>";
    $texte.="\n<td>";
    $texte.="\n<div>";
    $texte.="\n<span id='leftmd'>";
    $texte.="\n<textarea id=\"markdown\" onkeyup=\"ajax();\" rows=\"15\" cols=\"70\" name=\"comment\" >";
    //  $texte.="\n<textarea rows=\"15\" cols=\"70\" name=\"comment\" >";
    $texte.=$element->comment."</textarea>";
    $texte.="\n</span>";
    $texte.="\n</div>";
    $texte.="\n</td></tr>";
    $texte.="\n<tr><td>Preview :</td><td width=200px>";
    $texte.="\n<div>";
    $texte.="\n            <span id='rightmd' style=\"text-align: left; width: 20%;\">";
    $texte.="\n                Loading...";
    $texte.="\n            </span>";
    $texte.="\n</div>";
    $texte.="\n</td></tr>";

    $textetemp="";
    $textetemp.="\n<tr><td align=right> Visual Comment :</td>";
    $textetemp.="\n<td>";
    $textetemp.="\n<div>";
    $textetemp.="\n<span id='rightmd'>";
    $textetemp.="\n</span>";
    //   $textetemp.="\n            <span id='right'>";
    //   $textetemp.="\n                Loading...";
    //   $textetemp.="\n            </span>";
    $textetemp.="\n</div>";
    $textetemp.="\n</td></tr>";
    
    //  $texte.=$textetemp;
      }    
  else {
    $texte.="\n<input type=\"hidden\" name=\"id_writer\" value=\"".$_GET["id_writer"]."\" />";
    $texte.="\n<tr><td align=right>URN :</td><td><input type=\"text\" size=\"30\" name=\"URN\" value=\"urn:cite:dmk:dmk.\" /></td></tr>";

    $qi="SELECT w.urn AS wurn, a.urn as aurn  FROM works w, authors a WHERE a.id_author=w.id_author AND w.id_work=".$_GET["id_work"]."";
    //echo "<br />".$qi."<br />";
    $ri=$bd->query($qi);
    $ei = $ri->fetch_object();
    $texte.="\n<tr><td align=right>textURN :</td><td><input type=\"text\" size=\"30\" name=\"textURN\" value=\"urn:".$ei->aurn.".".$ei->wurn.":\" /></td></tr>";

    //print_r($_SESSION);
    $texte.="\n<tr><td align=right>commentURN :</td><td><input type=\"text\" size=\"30\" name=\"commentURN\" value=\"urn:cts:dmk:"
      .$_SESSION["firstname"]."".$_SESSION["lastname"].".\" /></td></tr>";
    $texte.="\n<tr><td align=right> Type :</td>";
    $texte.="\n<td><input type=\"text\" name=\"type\" value=\""
      .$element->type."\" size=30></td></tr>";
    $texte.="\n<tr><td align=right> Comment :</td>";
    $texte.="\n<td>";
    $texte.="\n<div>";
    $texte.="\n<span id='leftmd'>";
    $texte.="\n<textarea id=\"markdown\" onkeyup=\"ajax();\" rows=\"15\" cols=\"70\" name=\"comment\" >";
    //  $texte.="\n<textarea rows=\"15\" cols=\"70\" name=\"comment\" >";
    $texte.=$element->comment."</textarea>";
    $texte.="\n</span>";
    $texte.="\n</div>";
    $texte.="\n</td></tr>";
    $texte.="\n<tr><td>Preview :</td><td width=200px>";
    $texte.="\n<div>";
    $texte.="\n            <span id='rightmd' style=\"text-align: left; width: 20%;\">";
    $texte.="\n                Loading...";
    $texte.="\n            </span>";
    $texte.="\n</div>";
    $texte.="\n</td></tr>";

    $textetemp="";
    $textetemp.="\n<tr><td align=right> Visual Comment :</td>";
    $textetemp.="\n<td>";
    $textetemp.="\n<div>";
    $textetemp.="\n<span id='rightmd'>";
    $textetemp.="\n</span>";
    //   $textetemp.="\n            <span id='right'>";
    //   $textetemp.="\n                Loading...";
    //   $textetemp.="\n            </span>";
    $textetemp.="\n</div>";
    $textetemp.="\n</td></tr>";
    
    //  $texte.=$textetemp;
 

  }
 return($texte);
}


function more_id($id,$bd)
{
  $texte="\n<center>\n<table class=\"table\">";
  
    $qi="SELECT * FROM commentaries WHERE id_commentarie=".$id."";
    //    echo "<br />".$qi."<br />";
    $ri=$bd->query($qi);
    $ei = $ri->fetch_object();
    //  $texte.="\n<tr><td colspan=2><b>".$ei->textURN."</b></td></t>";


    $elt=trouve_champs("writers",array("lastname","firstname"),$ei->id_writer,$bd);
    $texte.="\n<tr><td align=right>Writer :</td><td>".$elt["firstname"]." ".$elt["lastname"]."</td></tr>";
    $texte.="\n<tr><td align=right>URN :</td><td>".$ei->URN."</b></tr>";
    $texte.="\n<tr><td align=right>textURN :</td><td>".$ei->textURN."</td></tr>";
    $texte.="\n<tr><td align=right>commentURN :</td><td>".$ei->commentURN."</td></tr>";
    $texte.="\n<tr><td align=right> Type :</td><td>".$ei->type."</td></tr>";
    $texte.="\n<tr><td>Preview :</td><td width=200px>";
    $texte.="\n<div>";
    $texte.="\n            <span id='rightmd' style=\"text-align: left; width: 20%;\">";
    $texte.="\n                Loading...";
    $texte.="\n            </span>";
    $texte.="\n</div>";
    $texte.="\n</td></tr>";

    $texte.="\n</table>\n</center>";


    $texte.="\n<span id='leftmd'>";
    //    $texte.="\n<textarea id=\"markdown\" onkeyup=\"ajax();\" rows=\"15\" cols=\"70\" name=\"comment\" >";
    //    //  $texte.="\n<textarea rows=\"15\" cols=\"70\" name=\"comment\" >";
    $texte.=$ei->comment;
    //    $texte.="</textarea>";
    $texte.="\n</span>";

    
 return($texte);
}


?>
