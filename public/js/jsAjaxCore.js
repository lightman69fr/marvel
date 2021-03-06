var AjaxHome = function(params)
{
    this.methode     = false;       // méthode de transmission des données
    this.page        = false;       // page appelée lors de la requète Ajax
    this.data        = false;       // (objet) contenant les données à envoyer
    this.headers     = false;       // [array] tableau des headers supplémentaires au format (objet)
    this.useCallback = false;       // fonction à appeler lorsque la requète a abouti (200);
    this.withLoader  = false;       // callback pour un éventuel Loader
    
    this.xhr         = false;       // lien XHR
    this.reponse     = false;       // réponse
    
    if(isDefined(params) && isObject(params))
    {
        if(params.hasOwnProperty('methode'))
        {
            this.methode = params.methode;
        }
        else
        {
            this.methode = 'POST';
        }
        
        
        if(params.hasOwnProperty('page'))
        {
            if(params.page.length > 2) // à sécuriser avec REGEX
            {
                this.page = params.page;
            }
            else
            {
                this.page = false;
                alert('La page est manquante');
            }
        }
        
        
        if(params.hasOwnProperty('data'))
        {
            this.data = params.data;
        }
        
        
        if(params.hasOwnProperty('headers'))
        {
            if(Array.isArray(params.headers))
            {
                this.headers = params.headers;
            }
            else
            {
                this.headers = false;
            }
        }
        
        
        if(params.hasOwnProperty('callback'))
        {
            if(isFunction(params.callback))
            {
                this.useCallback = params.callback;
            }
            else
            {
                this.useCallback = false;
            }
        }
        
        
        if(params.hasOwnProperty('withLoader'))
        {
            if(isFunction(params.withLoader))
            {
                this.withLoader = params.withLoader;
            }
            else
            {
                this.withLoader = false;
            }
        }
        
        
        
        
        
        
        if(this.methode !== false && this.page !== false)
        {
            this.xhr = this.createXHR();
            this.SendPage();
        }
    }
    else
    {
        alert('Vous devez définir les paramètres pour Ajax');
    }
}

AjaxHome.prototype=
{
    createXHR:function()
    {
        var xhr = false;
        
        if (window.XDomainRequest)
        {
            xhr = new XDomainRequest(); 
        }
        else if (window.XMLHttpRequest)
        {
            xhr = new XMLHttpRequest(); 
        }
        else
        {
            alert("Votre navigateur ne gère pas l'AJAX cross-domain !");
        }

        return xhr;
    },
    
    SendPage:function()
    {
        var This = this;
        
        if(this.methode !== false && this.page !== false)
        {
            var methode = this.methode;
            var page    = this.page;
            
            if(this.data !== false)
            {
                var urlParams = this.generateUrlParams();
            }
            else
            {
                urlParams = null;
            }
            
            var callback = this.useCallback;
            
            var xhrLink = this.xhr;
            xhrLink.onload=function()
            {
                if(xhrLink.status == 200)
                {
                    This.setReponse(xhrLink.responseText);
                    
                    if(isFunction(callback))
                    {
                        callback(xhrLink.responseText);
                    }
                    else
                    {
                        console.log('Réponse brute :');
                        console.log(xhrLink.responseText);
                    }
                }
                
            };
            
            xhrLink.onprogress=function()
            {
                if(!isBoolean(This.withLoader))
                {
                    var loader = This.withLoader;
                    loader();
                }
            }

            xhrLink.open(methode,page,true);
            
            if(Array.isArray(this.headers))
            {
                var tabHeaders = this.headers;
                
                for(var i=0; i< tabHeaders.length; i++)
                {
                    var header = tabHeaders[i];
                    this.addHeader(header);
                }
            }
            
            xhrLink.send(urlParams);
        }
    },
    
    
    
    getReponse:function()
    {
        return this.reponse;
    },
    
    setReponse:function(reponse)
    {
        this.reponse = reponse;
    },
    
    addHeader:function(objHeader)
    {
        var xhrLink = this.xhr;
        
        if(isDefined(xhrLink))
        {
            if(isObject(objHeader))
            {
                xhrLink.setRequestHeader(objHeader.titre,objHeader.valeur);
            }
        }
        else
        {
            alert('xhrLink non disponible');
        }
    },
    
    generateUrlParams:function()
    {
        var objDatas     = this.data;
        var chaineParams = '';
        
        if(Array.isArray(objDatas))
        {   
            var nbParams = objDatas.length;
            for(var i=0;i<nbParams;i++)
            {
                var datas = objDatas[i];
                
                chaineParams = chaineParams+ ExtractDatasFromObj(datas);
            }
            
        }
        else if(isObject(objDatas))
        {
            chaineParams = ExtractDatasFromObj(objDatas);
        }
        else
        {
            
        }
        
        function ExtractDatasFromObj (objParams)
        {
            var dataStr = '';
            
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
                            dataStr = dataStr+indexObj+'='+valChp;

                            if(incElem < nbElem -1)
                            {
                                dataStr +='&';
                            }
                        }
                    }

                    incElem++;

                    if(incElem < nbElem)
                    {

                    }
                }
            }
            
            return dataStr;
        }
        
        return chaineParams;
    },
};