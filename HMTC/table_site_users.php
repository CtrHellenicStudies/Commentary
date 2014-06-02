<?php

$table_details=Array("web"=>"Users",
		     "champs"=>Array("id_site_user","login","password","firstname","lastname","mail",
				     "id_site_accreditation","maj_timestamp","maj_id_site_user"),
		     "select"=>Array("defaut" =>" ORDER BY lastname"),
		     "options"=>Array()
		     );

function affiche_table_site_users_th()
{
  return("\n<th>Prénom</th><th>Nom</th><th>Accréditation</th>");
}


function affiche_table_site_users_tds($element,$bd)
{
  $txt="<td>".$element->firstname."</td>";
  $txt.="<td>".$element->lastname."</td>";
  $elt=trouve_champs("site_accreditations",Array("accreditation"),$element->id_site_accreditation,$bd);
  $txt.="\n<td align=center>".$elt."</td>";
  return($txt);
}


function affiche_formulaire_site_users($element,$bd)
{
  $texte="\n<tr><td align=right> Last Name :</td>";
  $texte.="\n<td><input type=\"text\" name=\"lastname\" value=\""
    .$element->lastname."\" size=30></td></tr>";
  $texte.="\n<tr><td align=right> First Name :</td>";
  $texte.="\n<td><input type=\"text\" name=\"firstname\" value=\""
    .$element->firstname."\" size=30></td></tr>";
  $texte.="\n<tr><td align=right> Login :</td>";
  $texte.="\n<td><input type=\"text\" name=\"login\" value=\""
    .$element->login."\" size=30></td></tr>";
  $texte.="\n<tr><td align=right> Password <a href=\"md5.php\" target=_MD5>MD5</a> :</td>";
  $texte.="\n<td><input type=\"text\" name=\"password\" value=\""
    .$element->password."\" size=30></td></tr>";
  $texte.="\n<tr><td align=right> Mail :</td>";
  $texte.="\n<td><input type=\"text\" name=\"mail\" value=\""
    .$element->mail."\" size=30></td></tr>";

  $texte.="\n<tr><td align=right>Accreditation :</td>";
  $texte.="\n<td><select name=\"id_site_accreditation\">";
  $texte.=select_option("site_accreditations",Array("accreditation"),"id_site_accreditation",
                        $element->id_site_accreditation,$bd);
  $texte.="\n</select></td></tr>";


  return($texte);
}


?>