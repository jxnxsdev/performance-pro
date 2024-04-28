let g_besetzung
besetzung_lesen()

function ablauf_lesen()
{
  $.ajax({
    url: "api/ablauf", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
       
    }),
      success:function(result){
        cardausgeben(result, "ausgabe")
        console.log(result);
       


        
      
    }
    ,error: function(result){
      
      console.log(result);
    }           
  } );

}

function besetzung_lesen()
{
  $.ajax({
    url: "api/kanaele", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
       
    }),
      success:function(result){
        g_besetzung = result
        console.log(g_besetzung)
        ablauf_lesen()

        
    }
    ,error: function(result){
      
      console.log(result);
    }           
  } );

}

function kanal_zu_name(kanal){
  let ret
  g_besetzung.forEach(function(m){
    if (kanal == m.id)
    {ret = m}

  })
  return ret 
}

function neu()
{
  $.ajax({
    url: "api/ablauf_neu", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
                
    }),
      success:function(result){
        cardausgeben(result, "ausgabe")
        console.log(result);      
    }
    ,error: function(result){
      
      console.log(result);
    }           
  } );
}

function save(id,stichwort,szene)
{
  
  $.ajax({
    url: "api/ablauf_save", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
                id: id
                , stichwort: stichwort
                , szene: szene
    }),
      success:function(result){
        cardausgeben(result, "ausgabe")
        console.log(result);      
    }
    ,error: function(result){
      
      console.log(result);
    }           
  } );

}
function move(id,richtung)
{
  
  $.ajax({
    url: "api/ablauf_move", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
                id: id
                , richtung: richtung
                
    }),
      success:function(result){
        cardausgeben(result, "ausgabe")
        console.log(result);      
    }
    ,error: function(result){
      
      console.log(result);
    }           
  } );

}

function copy(id,richtung)
{
  
  $.ajax({
    url: "api/ablauf_copy", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
                id: id
                , richtung: richtung
                
    }),
      success:function(result){
        cardausgeben(result, "ausgabe")
        console.log(result);      
    }
    ,error: function(result){
      
      console.log(result);
    }           
  } );

}

function add_(id)
{
  
  $.ajax({
    url: "api/ablauf_add", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
                id: id
                
    }),
      success:function(result){
        cardausgeben(result, "ausgabe")
        console.log(result);      
    }
    ,error: function(result){
      
      console.log(result);
    }           
  } );

}

function del_(id)
{
  
  $.ajax({
    url: "api/ablauf_del", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
                id: id
                
    }),
      success:function(result){
        cardausgeben(result, "ausgabe")
        console.log(result);      
    }
    ,error: function(result){
      
      console.log(result);
    }           
  } );

}

function toggle(id,kanal_nr,value)
{
  
  $.ajax({
    url: "api/ablauf_toggle", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
                id: id
                ,kanal_nr: kanal_nr
                , value: value
                
    }),
      success:function(result){
        return  result.return
        //console.log(result.return);      
    }
    ,error: function(result){
       return 0
      //console.log(result);
    }           
  } );

}

function cardausgeben(DatenAusgabe, AusgabeID) {
  var container = $('#'+ AusgabeID);
  container.empty();
  if (container) {


      DatenAusgabe.forEach(function(m, i) {


      
          //################ Jede Zeile #################
      
            let c = $('<div class="card" style="width: 98%; margin:20px"></div>')

            let cb = $('<div class="card-body"></div>')
            let ct = $('<h5 class="card-title"></h5>')
            ct.html(m.ablauf_id + " - Szene: " + m.szene + " - Stichwort: "+m.stichwort)
            let pen = $('<i class="bi bi-pen"></i>')
            pen.click(function(){
              let szl= $('<br><label for="szene" class="form-label">Szene:</label>')
              let sz = $('<input type="text" class="form-control" id="szene" name="szene">')
              sz.val(m.szene)
              
              let sl= $('<br><label for="stichwort" class="form-label">Stichwort:</label>')
              let s = $('<input type="text" class="form-control" id="stichwort" name="stichwort">')
              s.val(m.stichwort)
              
              let B = $('<button type="submit" class="btn btn-primary">Save</button>')
              B.click(function(){
                save(m.id, s.val(), sz.val())
                
                ct.html("Stichwort: "+s.val() + ' <i class="bi bi-pen hover-text"><span class="tooltip-text" id="right">Bearbeiten</span></i>')
                cb.append(ct)
              })
              cb.append(szl, sz, sl,s,  B)
            })
            let up = $('<i class="bi bi-arrow-bar-up hover-text"><span class="tooltip-text" id="right">Verschieben nach oben</span></i>')
            up.click(function(){
              move(m.id,-1)
            })
            let down = $('<i class="bi bi-arrow-bar-down hover-text"><span class="tooltip-text" id="right">Verschieben nach unten</span></i>')
            down.click(function(){
              move(m.id,1)
            })
            let copy_down = $('<i class="bbi bi-box-arrow-down hover-text"><span class="tooltip-text" id="right">Kopieren nach unten</span></i>')
            copy_down.click(function(){
              copy(m.id,1)
            })
            let add = $('<i class="bi bi-arrow-down-square hover-text"><span class="tooltip-text" id="right">Neu einfügen</span></i>')
            add.click(function(){
              add_(m.id)
            })

            let del = $('<i class="bi bi-x-square hover-text"><span class="tooltip-text" id="right">löschen</span></i>')
            del.click(function(){
              del_(m.id)
            })


            ct.append(pen, add, del, copy_down)
            if (m.ablauf_id > 1) ct.append(up)
            if (m.ablauf_id < DatenAusgabe.length) ct.append(down)
            cb.append(ct)
            j = JSON.parse(m.aktion)

            
            
// BTN für die einzelen
            j.forEach(function(k){
              
              if (k.value != 0 ) 
              {
                class_ = 'btn-success '
            
              }else
                {
                  class_ = 'btn-warning '
                }
              let name =  kanal_zu_name(k.id)
              //console.log(name)
              if (name.aktiv ){
              let B = $('<button type="submit">'+k.id+ ' ' + name.beschreibung_1 + '</button>')
              B.addClass('btn border border-5 btn_' + name.gruppe)
              B.css('margin-left','1px')

              B.addClass(class_)
              B.click(function(){
                
                B.removeClass('btn-warning','btn-success')
                B.addClass('btn-grey')
                // toggle(m.id, k.kanal_nr, 1- k.value )

                $.ajax({
                  url: "api/ablauf_toggle", //the page containing php script
                  type: "POST", //request type
                  dataType: 'json',
                  headers: { 'Content-Type': 'application/json' },
                  data: JSON.stringify({
                              id: m.id
                              ,kanal_nr: k.id
                              //, value: 1- k.value
                              
                  }),
                    success:function(result){
                      if (result.return == 2)
                      {
                        if (result.value == 1)
                        {B.addClass('btn-success')}
                        else
                        {B.addClass('btn-warning')}  
                      B.addClass() 
                      }
                    }
                  ,error: function(result){
                    B.removeClass(class_)
                    B.addClass(class__)
                  }    
                })       
              

                
                // ct.html("Stichwort: "+s.val() + ' <i class="bi bi-pen"></i>')
                // cb.append(ct)
              })
              cb.append(B)
            }

            })
            
            
            c.append(cb)

          container.append(c)  
          

      });
  }
}


