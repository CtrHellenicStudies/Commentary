#!/bin/bash

for fichier in `ls png_64/*.png`
do
    echo $fichier
    nom=${fichier#*/}
    echo $nom
    convert -geometry 16x16 $fichier png_16/$nom
    
done
