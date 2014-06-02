<?php
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function hautdepage($designation,$head="")
{
  global $authentifie,$les_tables,$mysqli;

  $query="SELECT * FROM ".BDD_PREFIXE."site_menus "
    ."WHERE designation='".$designation."' and open";
  //    echo $query."<br />";
  $result=$mysqli->query($query);
  $cemenu=$result->fetch_object();
  
  $html="<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">
<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"fr\">";
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Head
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$html.="

<head>
  <title>".$cemenu->title."</title>
  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />
  <meta http-equiv=\"Content-Script-Type\" content=\"text/javascript\" />  

  <!-- **** layout stylesheet **** -->
  <link rel=\"stylesheet\" type=\"text/css\" href=\"style/style.css\" />
  <link rel=\"stylesheet\" type=\"text/css\" href=\"style/".$cemenu->color.".css\" />
  <link rel=\"stylesheet\" type=\"text/css\" href=\"style/fonte.css\" />
  ".$head
  ."
        <style>"
  //            span     { text-align: left; width: 20% }
  ."
            leftmd     { float: up; }
            rightmd    { float: down;  }
        </style> 
        <script type='text/javascript'>
            function ajax()
            {
                if(window.XMLHttpRequest)
                    var request = new XMLHttpRequest();
                else if(window.ActiveXObject)
                    var request = ActiveXObject(\"Microsoft.XMLHTTP\");

                request.open(\"POST\", \"markdown_escape.php?mode=ajax\", true);
                request.setRequestHeader(\"Content-type\", \"application/x-www-form-urlencoded\");
                request.send('markdown=' + document.getElementById('markdown').value);

                var tmp = document.getElementById('markdown').value;

                request.onreadystatechange = function()
                {
                    if(request.readyState == 4 && request.status == 200)
                        document.getElementById('rightmd').innerHTML = request.responseText;
                }
            }

            window.onload = function(){ ajax(); }
        </script>

</head>";
//                        document.getElementById('rightmd').innerHTML = tmp + request.responseText;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Body
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$html.="

<body>
  <div id=\"main\">";
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Links ("première ligne" de la page)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$html.="    <div id=\"links\">";
  if (isset($authentifie))
    $html.="
      ".$authentifie;
$html.="
    </div> <!-- links -->";
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Menu
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$html.="
    <div id=\"logo\">
      <h1> </h1><br /><br /><br /><br /><h2>CHS - Harvard University</h2>
    </div> <!-- logo -->";
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Menu
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 $html.="
    <div id=\"menu\">";
  $html.=menu($designation);
 $html.="
    </div> <!-- menu -->";
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Content
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$html.="
    <div id=\"content\">";
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Colonne de droite
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$html.="
      <div id=\"column1\">";
 /////////////////////////////////////////////////////////////
 //Sous menu éventuel
// echo $designation."<br />";
 list($qui,$sousmenu)=explode("-",strtolower($designation));
 if ($qui!="participant")
   if (is_callable("sousmenu_".$sousmenu))
     $html.=call_user_func("sousmenu_".$sousmenu);
 if (($qui=="participant") and ($sousmenu=="logistique"))
   if (is_callable("sousmenu_".$sousmenu))
     $html.=call_user_func("sousmenu_".$sousmenu);
 /////////////////////////////////////////////////////////////
 // Menu du site privé d'un contact pour la partie secrétariat
 if ((isset($_SESSION["id_site_accreditation"])) and ($_SESSION["id_site_accreditation"]<30) and (isset($_GET["alea"])))
   $html.=sousmenu_lecontact($designation);
/////////////////////////////////////////////////////////////
 // Menu du site public pour la partie privée
 // $html.=sousmenu_public();
 /////////////////////////////////////////////////////////////
 $html.="
      </div> <!-- column1 -->";
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Colonne de gauche (principale)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$html.="
      <div  id=\"column2\">
<!-- ========================================================================================================================== -->

";
 return($html);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function basdepage()
{
  $html="

<!-- ========================================================================================================================== -->

      </div> <!-- column2 -->
    </div> <!-- content -->
    <div id=\"footer\">
      Copyright &copy; ".date("Y");
  if (isset($_SESSION["id_site_accreditation"]) and ($_SESSION["id_site_accreditation"]<99)) {
    if ($_SESSION["id_site_accreditation"]<99)
      $html.=" - <a href=\"mailto:said.belmehdi@math.univ-lille1.fr\">Saïd Esteban Belmehdi</a> - <a href=\"mailto:francois.recher@math.univ-lille1.fr\">François Recher</a>";
  }
  else
    if (isset($_SESSION))
      session_destroy();
  $html.=" - iMouseion
    </div> <!-- footer -->
  </div> <!-- main -->
</body>
</html>";
  return($html);
}

?>
