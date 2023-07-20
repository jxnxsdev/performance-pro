// window.addEventListener('keydown', function(event){ 
//   switch(event.keyCode) { 
//     case 112: f1(); break; 
//     case 113: f2(); break; 
//     case 114: f3(); break; 
//     case 115: f4(); break; 
//     case 116: f5(); break; 
//     case 117: f6(); break; 
//     case 118: f7(); break; 
//     case 119: f8(); break; 
//     case 120: f9(); break; 
//     case 121: f10(); break; 
//     case 122: f11(); break; 
//     case 123: f12(); break; 
//   } 
//   event.preventDefault(); 
// }); 

// function f1() { 
//   // mein Code für die Taste F1 
//   console.log("F1")
// }


//document.getElementById("accordionFlushExample").appendChild( CreateAccordionItem());

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
    url: "api/besetzung", //the page containing php script
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
    if (kanal == m.kanal_nr)
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

function save(id,stichwort)
{
  
  $.ajax({
    url: "api/ablauf_save", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
                id: id
                , stichwort: stichwort
                
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
            ct.html(m.ablauf_id + " - Stichwort: "+m.stichwort)
            let pen = $('<i class="bi bi-pen"></i>')
            pen.click(function(){
              let sl= $('<br><label for="stichwort" class="form-label">Stichwort:</label>')
              let s = $('<input type="text" class="form-control" id="stichwort" name="stichwort">')
              s.val(m.stichwort)
              
              let B = $('<button type="submit" class="btn btn-primary">Save</button>')
              B.click(function(){
                save(m.id, s.val())
                
                ct.html("Stichwort: "+s.val() + ' <i class="bi bi-pen"></i>')
                cb.append(ct)
              })
              cb.append(sl,s,  B)
            })
            let up = $('<i class="bi bi-arrow-bar-up"></i>')
            up.click(function(){
              move(m.id,-1)
            })
            let down = $('<i class="bi bi-arrow-bar-down"></i>')
            down.click(function(){
              move(m.id,1)
            })
            let add = $('<i class="bi bi-arrow-down-square"></i>')
            add.click(function(){
              add_(m.id)
            })

            ct.append(pen, add)
            if (m.ablauf_id > 1) ct.append(up)
            if (m.ablauf_id < DatenAusgabe.length) ct.append(down)
            cb.append(ct)
            j = JSON.parse(m.aktion)

            
            

            j.forEach(function(k){
              
              if (k.value != 0 ) 
              {
                class_ = 'btn-success'
            
              }else
                {
                  class_ = 'btn-warning'
                }
              let name =  kanal_zu_name(k.kanal_nr)
              //console.log(name)
              let B = $('<button type="submit">'+k.kanal_nr+ ' ' + name.beschreibung_1 + '</button>')
              B.addClass('btn')
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
                              ,kanal_nr: k.kanal_nr
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

            })
            
            
            c.append(cb)

          container.append(c)  
          

      });
  }
}


