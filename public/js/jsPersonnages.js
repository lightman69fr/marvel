var Personnages = function (params)
{
    var mode = 'liste';
    
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
                    
                }
            }
        }
    }
    
    switch (mode)
    {
        default:
            this.getListPersonnages();
        break;
        
        case 'liste':
            this.getListPersonnages();
        break;
            
        case 'showPers':
            
            if(params.hasOwnProperty('persID'))
            {
                var persID = parseInt(params.persID);
                this.getPersonnage(persID);
            }
            else
            {
                alert('Aucun id de persnnage fourni');
            }
        break;
    }
};

Personnages.prototype=
{
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
        
        var This = this;
        
        var PRIV_KEY   = "5d62c8396ef3ff66213aeac64e020ce8e51743f8";
        var PUBLIC_KEY = "a16d8956cd76927ea53d489bba636c59";
        
        var ts   = new Date().getTime();
        var hash = md5(ts + PRIV_KEY + PUBLIC_KEY);
        
        var params =
        {
            "apikey": PUBLIC_KEY,
            "ts"    : ts,
            "hash"  : hash
        };
        
        
        var dataAPI_CharacterDataContainer =
        {
            offset  : 0,
            limit   : 100,
            orderBy : 'onsaleDate'
        };
        
        var apiParams = this.generateUrlParams(dataAPI_CharacterDataContainer);
        
        var pageReadComics = 'http://gateway.marvel.com/v1/public/characters/'+personnageID+'/comics?ts='+ts+'&apikey='+PUBLIC_KEY+'&hash='+hash+'&'+apiParams;
        var pageReadPerso  = 'http://gateway.marvel.com/v1/public/characters/'+personnageID+'?ts='+ts+'&apikey='+PUBLIC_KEY+'&hash='+hash;
        var methode        = 'GET';
        
        var headers =
        [
            {
                titre  : 'Access-Control-Allow-Origin',
                valeur : '*'
            }
        ];
        
        var json_infosPersonnages = null;
        var json_listeComics      = null;
            
        
        var paramsAjaxPerso =
        {
            page     : pageReadPerso,
            methode  : methode,
            callback : function (reponse)
            {
                var rep = JSON.parse(reponse);
                
                json_infosPersonnages = rep;
                
                var paramsAjaxComics =
                {
                    page     : pageReadComics,
                    methode  : methode,
                    callback : function (reponse)
                    {
                        var rep = JSON.parse(reponse);
                        
                        json_listeComics = rep;
                        
                        This.showPersonnage(json_infosPersonnages,json_listeComics);
                    },
                };
                
                var ajaxComics = new AjaxHome(paramsAjaxComics);
                
            },
        };
        
        
        var ajaxPerso = new AjaxHome(paramsAjaxPerso); 
        
    },
    
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
                    if(sizeOf(infosPersonnage.description > 0))
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

                var personnage =
                {
                    id          : persID,
                    nom         : nom,
                    description : description,
                    image       : image
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
            
            if(data.hasOwnProperty('count'))
            {
                nbComics = data.count.toString();
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
                        }
                        
                        listeComicsShort[i] =
                        {
                            id          : comicID,
                            titre       : comicTitle,
                            description : comicDesc,
                            images      : comicImages,
                            dates       : comicDates
                        };
                    }
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
        
        var dataPersonnage = JSON.stringify(objDonneesPersonnage);
        var dataComics     = JSON.stringify(objDonneeComics);
        
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
            methode  : methode,
            data     : params,
            headers  : 
            [
                {
                    titre  : 'Content-type',
                    valeur : 'application/x-www-form-urlencoded'
                }
            ],
            callback : function(reponse)
            {
                var cData = getID('cDataPersonnage');
                cData.innerHTML = reponse;
            }
        };

        var ajax = new AjaxHome(paramsAjax);
        
        /*
        for (var i=0;i<listePersonnages.length;i++)
        {
            var pers = listePersonnages[i];
            objListePersonnages['pers'+pers.persID] = JSON.stringify(pers);
        }

        
        
        /******************* / envoi des données du personnage *******************/
    },
    
    
    
    
    
    
    getListPersonnages:function()
    {
        var This = this;
        
        var PRIV_KEY   = "5d62c8396ef3ff66213aeac64e020ce8e51743f8";
        var PUBLIC_KEY = "a16d8956cd76927ea53d489bba636c59";
        
        var ts   = new Date().getTime();
        var hash = md5(ts + PRIV_KEY + PUBLIC_KEY);
        
        var params =
        {
            "apikey": PUBLIC_KEY,
            "ts"    : ts,
            "hash"  : hash
        };
        
        
        var dataAPI_CharacterDataContainer =
        {
            offset : 100,
            limit  : 22
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
                This.showListChars(rep);
            },
        };
        
        var ajax = new AjaxHome(paramsAjax);  
    },
    
    showListChars:function(json_listChars)
    {
        if(json_listChars.hasOwnProperty('data'))
        {
            var data = json_listChars.data;
            
            var nombre = data.count;
            var debut  = data.offset;
            
            var image  = null;
            var persID = null;
            var comics = ('non disponnible');
            
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
                        
                        var objPerso =
                        {
                            persID : personnage.id,
                            nom    : personnage.name,
                            image  : image,
                            comics : comics
                        };
                        
                        listePersonnages[i] = objPerso;
                    }
                }
            }
            
            
            var objListePersonnages = {};
            
            for (var i=0;i<listePersonnages.length;i++)
            {
                var pers = listePersonnages[i];
                objListePersonnages['pers'+pers.persID] = JSON.stringify(pers);
            }
            
            var params = objListePersonnages;
            
            var page    = '/getChars';
            var methode = 'POST';
            
            var paramsAjax =
            {
                page     : page,
                methode  : methode,
                data     : params,
                headers  : 
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