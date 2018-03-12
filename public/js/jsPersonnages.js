/*
*
* Classe Personnages
* Créée le 08 mars 2018
* Auteur                : Guillaume Giroud
* Dernière modification : 08 mars 2018
*
*/

var Personnages = function (params)
{
    var PUBLIC_KEY = configKeys.public_key;
    var ts         = new Date().getTime();
    var hash       = md5(ts+configKeys.private_key+configKeys.public_key); 
    
    var mode       = 'liste';     //mode par défaut : liste des personnages
    
    this.PUBLIC_KEY = PUBLIC_KEY;
    this.hash       = hash;
    this.ts         = ts;
    
    
    //on vérifie que des paramètres sont présents et valides
    if(isDefined(params))
    {
        if(isObject(params))
        {
            if(params.hasOwnProperty('mode'))
            {
                if(isString(params.mode))
                {
                    mode = params.mode;
                }
                else
                {
                    // sinon, le mode reste celui par défaut.
                }
            }
        }
    }
    
    switch (mode)
    {
        default:        // on récupère la liste des personnages, quoi qu'il arrive.
            this.getListPersonnages();
        break;
        
        case 'liste':   //si c'est le mode "liste", on récupère la liste des personnages.
            if(isDefined(params) && params.hasOwnProperty('paramsListe'))
            {
                var paramsListe = params.paramsListe;
            }
            else
            {
                var paramsListe = undefined;
            }
            this.getListPersonnages(paramsListe);
        break;
            
        case 'showPers':    // si c'est le mode "showPers", on affiche le personnage choisi
            if(params.hasOwnProperty('persID')) // en fonction de son ID, si il est présent
            {
                var persID = parseInt(params.persID);
                this.getPersonnage(persID);
            }
            else
            {   // sinon, on affiche un alert
                alert('Aucun id de persnnage fourni');
            }
        break;
    }
};

Personnages.prototype=
{
    // méthode de récupération du personnage par son ID
    getPersonnage:function(personnageID)
    {
        if(isDefined(personnageID) )
        {
            if(isInt(personnageID))
            {
            }
            else
            {
            }
        }
        
        var This       = this;
        var PUBLIC_KEY = This.PUBLIC_KEY;   //"a16d8956cd76927ea53d489bba636c59";
        var hash       = This.hash;         //'552f39f60cff390bd30671513415f1ba';
        var ts         = This.ts;           //new Date().getTime();
        
        // Paramètres permettant de sélectionner les 100 premiers comics, par ordre de vente (parution).
        var dataAPI_ComicsListParameters =
        {
            offset  : 0,
            orderBy : 'onsaleDate%2CissueNumber'
        };
        
        var apiParams      = this.generateUrlParams(dataAPI_ComicsListParameters);  // création des paramètres pour la requète d'accès à l'API Marvel en mode Server Side
        
        // requètes de sélection sur l'API Marvel en mode Server Side.
        var pageReadComics = 'http://gateway.marvel.com/v1/public/characters/'+personnageID+'/comics?ts='+ts+'&apikey='+PUBLIC_KEY+'&hash='+hash+'&'+apiParams; // liste des comics
        var pageReadPerso  = 'http://gateway.marvel.com/v1/public/characters/'+personnageID+'?ts='+ts+'&apikey='+PUBLIC_KEY+'&hash='+hash;                      // infos personnage
        var methode        = 'GET';
        
        
        // Nécessaire pour exécuter la requète Ajax pour interroger l'API Marvel
        // Permet d'autoriser le navigateur à obtenir les donnée de l'API depuis une IP différente de celle où est hébergée le script (Cross Domain)
        var headers =
        [
            {
                titre  : 'Access-Control-Allow-Origin',     // titre de l'entête : Pour le Cross Domain : adresse à autoriser
                valeur : '*'                                // ici, on autorise le Cross Domain depuis n'importe où.
            }
        ];
        
        
        var json_infosPersonnages = null;
        var json_listeComics      = null;    
        
        // requète de récupération des infos sur le personnage
        var paramsAjaxPerso =
        {
            page     : pageReadPerso,
            methode  : methode,         // méthode d'envoie des données. ICI, c'est GET
            callback : function (reponse)
            {
                var rep = JSON.parse(reponse);
                
                json_infosPersonnages = rep;
                
                var paramsAjaxComics =
                {
                    page     : pageReadComics,      // url de récupération des comics
                    methode  : methode,
                    callback : function (reponse)
                    {
                        var rep = JSON.parse(reponse);  // formatage de la liste des comics au format JSON
                        
                        json_listeComics = rep;
                        
                        // une fois tout récupéré, on fait un appel à la méthode showPersonnage qui se charge de faire le tri dans les données et de les envoyer en JSON à Symfony4
                        This.showPersonnage(json_infosPersonnages,json_listeComics);
                    },
                    withLoader : function()     // callback pour le message d'attente
                    {
                        var cListe = getID('cDataPersonnage');

                        if(!BlocPresent('cLoader_getPersonnage'))
                        {
                            var cLoader = document.createElement('div');
                            cLoader.id = 'cLoader_getPersonnage';
                            cLoader.addClass('loader');;
                            cListe.appendChild(cLoader);
                        }
                        else
                        {
                            var cLoader = getID('cLoader_getPersonnage');
                        }

                        cLoader.innerHTML = '<div><div>Chargement des données</div></div>';
                    }
                    
                };
                
                //  exécution de la requète Ajax
                var ajaxComics = new AjaxHome(paramsAjaxComics);
            },
        };
        
        //  exécution de la requète Ajax
        var ajaxPerso = new AjaxHome(paramsAjaxPerso);
    },
    
    
    // Méthode permettant d'afficher le personnage choisi
    // paramètres :
    //      json_infosPersonnage : informations sur le personnage
    //      json_listeComics     : liste des comics
    showPersonnage:function(json_infosPersonnage,json_listeComics)
    {
        /******************** Informations sur le personnage ********************/
        
        if (json_infosPersonnage.hasOwnProperty('data'))
        {
            var data = json_infosPersonnage.data;
            
            if(data.hasOwnProperty('results'))
            {
                var infosPersonnage = data.results[0];
                var persID          = null;
                var nom             = null;
                var description     = '';
                var image           = null;

                if(infosPersonnage.hasOwnProperty('id'))
                {
                    persID = infosPersonnage.id.toString();
                }
                
                if(infosPersonnage.hasOwnProperty('name'))
                {
                    nom = infosPersonnage.name;
                }
                
                if(infosPersonnage.hasOwnProperty('description'))
                {
                    if(sizeOf(infosPersonnage.description) > 0)
                    {
                        description = infosPersonnage.description;
                    }
                }

                if(infosPersonnage.hasOwnProperty('thumbnail'))
                {
                    if(infosPersonnage.thumbnail.hasOwnProperty('path') && infosPersonnage.thumbnail.hasOwnProperty('extension'))
                    {
                        image = infosPersonnage.thumbnail.path+'.'+infosPersonnage.thumbnail.extension;
                    }
                }
                
                // données du personnage qui seront envoyées à PHP
                var personnage =
                {
                    id          : persID,       // id du personnage
                    nom         : nom,          // nom du personnage
                    description : description,  // description du personnage
                    image       : image         // image du personnage
                };
            }
            else
            {
                console.log('impossible de récupérer les données du personnage');
            }
        }
        else
        {
            console.log('aucune donnée disponible pour ce personnage');
        }
        
        /******************* / Informations sur le personnage *******************/
        
        
        
        
        
        /******************** Liste des comics du personnage ********************/
        if (json_listeComics.hasOwnProperty('data'))
        {
            var data        = json_listeComics.data;
            var nbComics    = 0;
            var listeComics = null;
            
            if(data.hasOwnProperty('total'))
            {
                nbComics = data.total.toString();
            }
            
            if(data.hasOwnProperty('results'))
            {
                if(Array.isArray(data.results))
                {
                    var listeComics      = data.results;
                    var listeComicsShort = [];
                    
                    var comicID          = null;
                    var comicTitle       = null;
                    var comicDesc        = null;
                    var comicImages      = null;
                    var comicDates       = null;
                    
                    for(var i=0;i<listeComics.length;i++)
                    {
                        var comic = listeComics[i];
                        if(isObject(comic))
                        {
                            //console.log(comic);
                            
                            if(comic.digitalId > 0)
                            {
                                if(comic.hasOwnProperty('id'))
                                {
                                    comicID = comic.id.toString();
                                }

                                if(comic.hasOwnProperty('title'))
                                {
                                    comicTitle = comic.title;
                                }

                                if(comic.hasOwnProperty('description'))
                                {
                                    comicDesc = comic.description;
                                }

                                if(comic.hasOwnProperty('images'))
                                {
                                    comicImages = comic.images;
                                }

                                if(comic.hasOwnProperty('dates'))
                                {
                                    comicDates = comic.dates;
                                }

                                // données du comic
                                listeComicsShort[i] =
                                {
                                    id          : comicID,          // id du comic
                                    titre       : comicTitle,       // titre du comic
                                    description : comicDesc,        // description du comic
                                    images      : comicImages[0],   // image(s) du comic
                                    dates       : comicDates        // date(s) du comic
                                };
                            }
                            
                        }
                    }
                    
                    listeComicsShort.clean();
                }
            }
            else
            {
                console.log('impossible de récupérer la liste des comics pour ce personnage');
            }
        }
        /******************* / Liste des comics du personnage *******************/
        
        
        
        /******************** envoi des données du personnage ********************/
        
        var objDonneesPersonnage =
        {
            infosPersonnage : personnage
        };
        
        var objDonneeComics =
        {
            nbComics        : nbComics,
            listeDesComics  : listeComicsShort
        };
        
        var dataPersonnage = JSON.stringify(objDonneesPersonnage);  // mise en forme des données du personnage pour la transmission
        var dataComics     = JSON.stringify(objDonneeComics);       // mise en forme de la liste des comics pour la transmission
        
        
        // données pour la transmission vers Symfony4
        var page    = '/showCharDetails';
        var methode = 'POST';
        
        var params =
        {
            dataPersonnage : dataPersonnage,
            dataComics     : dataComics
        };
        
        var paramsAjax =
        {
            page     : page,
            methode  : methode,     // pour la transmission des données, c'est POST
            data     : params,
            headers  : 
            [
                {
                    titre  : 'Content-type',
                    valeur : 'application/x-www-form-urlencoded'    // nécessaire pour l'envoi de données en mode POST
                }
            ],
            callback : function(reponse)
            {
                var cData = getID('cDataPersonnage');
                cData.innerHTML = reponse;      // affichage du personnage dans le bloc
            },
            withLoader : function()
            {
                var cPers = getID('cDataPersonnage');
                
                if(!BlocPresent('cLoader_personnage'))
                {
                    var cLoader = document.createElement('div');
                    cLoader.id = 'cLoader_personnage';
                    cLoader.addClass('loader');;
                    cPers.appendChild(cLoader);
                }
                
                cLoader.innerHTML = '<div><div>Chargement des données</div></div>';
            }
        };

        var ajax = new AjaxHome(paramsAjax);
        
        /******************* / envoi des données du personnage *******************/
    },
    
    
    
    
    
    // méthode permettant de récupérer la liste des personnages
    getListPersonnages:function(params)
    {
        var selectionStartAt = 100; // valeur par défaut
        var nbByPage         = 22;  // valeur par défaut
        
        var selectLimit  = parseInt(getID('selectLimit').value);
        var pageCourante = parseInt(getID('pageCourante').value);
        
        if(pageCourante > 0 && !isDefined(params))
        {
            selectionStartAt = (pageCourante-1)*selectLimit;
            nbByPage         = selectLimit;
        }
        else if(isDefined(params))
        {
            if(isObject(params))
            {
                if(params.hasOwnProperty('selectFrom'))
                {
                    selectionStartAt = parseInt(params.selectFrom);
                }
                if(params.hasOwnProperty('nbByPage'))
                {
                    nbByPage         = parseInt(params.nbByPage);
                }
            }
            else
            {
                
            }
        }
        else
        {
            
        }
        
        var This       = this;
        var PUBLIC_KEY = This.PUBLIC_KEY;
        var hash       = This.hash;
        var ts         = This.ts;
        
        var params =
        {
            "apikey": PUBLIC_KEY,
            "ts"    : ts,
            "hash"  : hash
        };
        
        
        var dataAPI_CharacterDataContainer =
        {
            offset : selectionStartAt,
            limit  : nbByPage
        };
        
        var apiParams = this.generateUrlParams(dataAPI_CharacterDataContainer);
        
        var page       = 'http://gateway.marvel.com/v1/public/characters?ts='+ts+'&apikey='+PUBLIC_KEY+'&hash='+hash+'&'+apiParams;
        var methode    = 'GET';
        
        var headers =
        [
            {
                titre  : 'Access-Control-Allow-Origin',
                valeur : '*'
            }
        ];
        
        var paramsAjax =
        {
            page     : page,
            methode  : methode,
            callback : function (reponse)
            {
                var rep = JSON.parse(reponse);
                This.showListChars(rep,nbByPage,selectionStartAt,pageCourante);
            },
            withLoader : function()
            {
                var cListe = getID('cListe');
                
                if(!BlocPresent('cLoader_listePersonnages'))
                {
                    var cLoader = document.createElement('div');
                    cLoader.id = 'cLoader_listePersonnages';
                    cLoader.addClass('loader');;
                    cListe.appendChild(cLoader);
                }
                
                cLoader.innerHTML = '<div><div>Chargement des données</div></div>';
            }
        };
        
        var ajax = new AjaxHome(paramsAjax);  
    },
    
    showListChars:function(json_listChars,nbByPage,selectionStartAt,pageCourante)
    {
        if(json_listChars.hasOwnProperty('data'))
        {
            var data = json_listChars.data;
            
            var nombre   = data.count;
            var debut    = data.offset;
            var total    = data.total;
            
            var image    = null;
            var persID   = null;
            var hasDesc  = 0;
            var inComics = 0;
            
            var listePersonnages = [];
            
            if(Array.isArray(data.results))
            {
               var dataChars = data.results;
                
                for(var i=0; i< nombre; i++)
                {
                    var personnage = dataChars[i];
                    
                    if(isObject(personnage))
                    {
                        var nom = 'inconnu';
                        
                        if(personnage.hasOwnProperty('name'))
                        {
                            nom = personnage.name;
                        }
                        
                        if(personnage.hasOwnProperty('id'))
                        {
                            persID = personnage.id;
                        }

                        if(personnage.hasOwnProperty('thumbnail'))
                        {
                            image = personnage.thumbnail.path+'.'+personnage.thumbnail.extension;
                        }
                        
                        if(personnage.hasOwnProperty('description'))
                        {
                            if(sizeOf(personnage.description) > 0)
                            {
                                hasDesc = sizeOf(personnage.description);
                            }
                            else
                            {
                                hasDesc = 0;
                            }
                        }
                        
                        if(personnage.hasOwnProperty('comics'))
                        {
                            if(personnage.comics.hasOwnProperty('available'))
                            {
                                inComics = personnage.comics.available.toString();;
                            }
                        }
                        
                        hasDesc = hasDesc.toString();
                        total   = total.toString();
                        
                        var objPerso =
                        {
                            persID    : personnage.id,
                            nom       : personnage.name,
                            image     : image,
                            hasDesc   : hasDesc,
                            inComics  : inComics
                        };
                        
                        listePersonnages[i] = objPerso;
                    }
                }
            }
            
            var paramsPagination =
            {
                total        : total,
                start        : selectionStartAt,
                limit        : nbByPage,
                pageCourante : pageCourante
            };
            
            paramsPagination = JSON.stringify(paramsPagination);
            
            var objListePersonnages = {};
            
            for (var i=0;i<listePersonnages.length;i++)
            {
                var pers = listePersonnages[i];
                objListePersonnages['pers'+pers.persID] = JSON.stringify(pers);
            }
            
            objListePersonnages = JSON.stringify(objListePersonnages);
            
            var params =
            {
                listePersonnages  : objListePersonnages,
                donneesPagination : paramsPagination
            };
            
            
            var page    = '/getChars';
            var methode = 'POST';
            
            var paramsAjax =
            {
                page      : page,
                methode   : methode,
                data      : params,
                headers   : 
                [
                    {
                        titre  : 'Content-type',
                        valeur : 'application/x-www-form-urlencoded'
                    }
                ],
                callback : function(reponse)
                {
                    var cList = getID('cListe');
                    cList.innerHTML = reponse;
                    
                    var filtres   = new Filtrages();
                    var selection = new Selection();
                    
                    getID('nbParPage').value      = nbByPage;
                    getID('selectionStart').value = selectionStartAt;
                },
                withLoader : function()
                {
                    var cListe = getID('cListe');

                    if(!BlocPresent('cLoader_showListePersonnages'))
                    {
                        var cLoader = document.createElement('div');
                        cLoader.id = 'cLoader_showListePersonnages';
                        cLoader.addClass('loader');
                        cListe.appendChild(cLoader);
                    }

                    cLoader.innerHTML = '<div><div>Chargement des données</div></div>';
                }
            };
            
            var ajax = new AjaxHome(paramsAjax);
        }
    },
    
    
    
    
    
    
    
    
    
    generateUrlParams:function(objParams)
    {
        var chaineParams = '';
        
        var nbElem  = sizeOf(objParams);
        var incElem = 0;

        for (var indexObj in objParams)
        {
            var valChp = objParams[indexObj];

            if(typeof valChp !== 'function')
            {
                if(valChp.toString().length > 0)
                {
                    if(indexObj != 'formDocument')
                    {
                        chaineParams = chaineParams+indexObj+'='+valChp;

                        if(incElem < nbElem -1)
                        {
                            chaineParams +='&';
                        }
                    }
                }

                incElem++;

                if(incElem < nbElem)
                {

                }
            }
        }
        
        return chaineParams;
    },
}
