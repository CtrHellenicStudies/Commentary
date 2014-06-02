<?php

$table_details=Array("web"=>"Accreditations",
		     "champs"=>Array("id_site_accreditation","accreditation","maj_timestamp","maj_id_site_user"),
		     "select"=>Array("defaut" =>" ORDER BY id_site_accreditation"),
		     "options"=>Array()
		     );

function affiche_table_site_accreditations_th()
{
  return("\n<th>Id</th><th>Accreditation</th><th>Modified</th><th>par</th>");
}


function affiche_table_site_accreditations_tds($element,$bd)
{
  $txt="<td>".$element->id_site_accreditation."</td>";
  $txt.="<td>".$element->accreditation."</td>";
  $txt.="\n<td align=center>".timestamp2txt($element->maj_timestamp,"jjmahms")."</td>";
  $elt=trouve_champs("site_users",Array("firstname","lastname"),$element->maj_id_site_user,$bd);
  $txt.="\n<td align=center>".$elt["firstname"]."</td>";//" ".$elt["nom"].
  return($txt);
}


function affiche_formulaire_site_accreditations($element,$bd)
{
  $texte="\n<tr><td align=right> Accréditation :</td>";
  $texte.="\n<td><input type=\"text\" name=\"accreditation\" value=\""
    .$element->accreditation."\" size=30></td></tr>";
  return($texte);
}


?>