var Selection = function()
{
    if(BlocPresent('blocSelections'))
    {
        this.initSelection();
    }
    
};

Selection.prototype=
{
    initSelection:function()
    {
        var This = this;
        
        var chpNbParPage   = getID('nbParPage');
        var chpSelectFrom  = getID('selectionStart');
        var btnValidSelect = getID('validSelection');
        
        btnValidSelect.addClick(This.postSelection);
    },
    
    postSelection:function(evt)
    {
        var chpNbParPage  = getID('nbParPage');
        var chpSelectFrom = getID('selectionStart');
        
        var nbParPage     = chpNbParPage.value;
        var selectFrom    = chpSelectFrom.value;
        
        var regNb = /^[0-9]{1,5}$/g;
        
        if(nbParPage.match(regNb) && selectFrom.match(regNb))
        {
            nbParPage  = parseInt(nbParPage);
            selectFrom = parseInt(selectFrom);
            
            if(nbParPage > 100)
            {
                nbParPage = 100;
            }
            
            if(nbParPage < 1)
            {
                nbParPage = 1;
            }
            
            if(selectFrom < 0)
            {
                selectFrom = 0;
            }
            
            var paramsListe =
            {
                mode        : 'liste',
                paramsListe : 
                {
                    selectFrom : selectFrom,
                    nbByPage   : nbParPage
                }
            };

            var listePersonnages = new Personnages(paramsListe);
        }
        else
        {
            alert('Vous n\'avez pas saisi un nombre');
        }
    },
};
