#!/bin/bash
echo "Script de push pour GitHub"
echo "Veuillez choisir le dossier a envoyer : "
read dir
cd $dir

echo "Saisissez les informations de mise a jours :"
read maj

git add .
git commit -m "$maj"
git push

