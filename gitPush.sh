!/bin/bash
echo "Script de push pour GitHub"
echo "Veuillez choisir le dossier a envoyer : "
read dir

cd $dir

git add .
git status
git push

