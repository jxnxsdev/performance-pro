window.addEventListener('keydown', function(event){ 
  switch(event.keyCode) { 
    case 112: send('ablauf_produktion_weiter'); break; // F1
    case 113: send('ablauf_produktion_zurueck'); break; // F2
   
  } 
  event.preventDefault(); 
}); 

$('#midi_send_all').click(function(){
  
  $.ajax({
    url: "api/midi_send_all", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
       value: Number($('#midi_send_all').prop('checked'))
    })
  })

})



$.ajax({
  url: "api/midi_send_all", //the page containing php script
  type: "GET", //request type
  dataType: 'json',
  headers: { 'Content-Type': 'application/json' },
  success:function(result){
    console.log(result)
    if (result[0].value == '1'){$('#midi_send_all').prop('checked', true);}else{$('#midi_send_all').prop('checked', false);}
  }
})
//document.getElementById("accordionFlushExample").appendChild( CreateAccordionItem());

let g_besetzung
let g_ablauf_akt_punkt
besetzung_lesen()

function ablauf_lesen(ablauf_id)
{
  $.ajax({
    url: "api/ablauf_produktion", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
       ablauf_id: ablauf_id
    }),
      success:function(result){
        cardausgeben(result, "ausgabe")
        console.log(result);
        maskierung_lesen()


        
      
    }
    ,error: function(result){
      
      console.log(result);
    }           
  } );

}
szeneliste()
function szeneliste()
{
  $.ajax({
    url: "api/szeneliste", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
       
    }),
      success:function(result){
        szenelisteausgeben(result, "szeneliste")



        
      
    }
    ,error: function(result){
      
      console.log(result);
    }           
  } );

}
function send(api,ablauf_id)
{
  $.ajax({
    url: "api/" +api, //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      ablauf_id: ablauf_id
    }),
      success:function(result){
        cardausgeben(result, "ausgabe")
        console.log(result);
        maskierung_lesen()
        szeneliste()
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
        ablauf_akt_punkt_lesen()



        
    }
    ,error: function(result){
      
      console.log(result);
    }           
  } );

}

function maskierung_lesen()
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
        result.forEach(function(m){
          console.log(m)
          if (m.maskierung == 0)
          {$('.maskierung_'+m.id).attr('hidden','');}
            else
          {$('.maskierung_'+m.id).removeAttr('hidden');}
        })


        
    }
    ,error: function(result){
      
      console.log(result);
    }           
  } );

}

function ablauf_akt_punkt_lesen()
{
  $.ajax({
    url: "api/ablauf_akt_punkt", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
       
    }),
      success:function(result){
        g_ablauf_akt_punkt = result[0].value
        console.log(result)
        ablauf_lesen(g_ablauf_akt_punkt)

        
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
            if (i == 0)c.css("background-color",localStorage.getItem('current_scene_color'));
            else if (i == 1)c.css("background-color",localStorage.getItem('next_scene_color'));
            else c.css("background-color",localStorage.getItem('following_scene_color'));

            let cb = $('<div class="card-body"></div>')
            let ct = $('<h5 class="card-title"></h5>')
            ct.html(m.ablauf_id + " - Szene: " + m.szene + " - Stichwort: "+m.stichwort)

            cb.append(ct)
            j = JSON.parse(m.aktion)

            
            

            j.forEach(function(k){
              
              let name =  kanal_zu_name(k.id)
              if (name.aktiv == 1)
              {
                if (k.value != 0 ) 
                {
                  class_ = 'btn-success'
              
                }else
                  {
                    class_ = 'btn-warning'
                  }
                //console.log(name)
                let B = $('<button type="submit">'+k.id+ ' ' + name.beschreibung_1 + '<span class="badge rounded-pill badge-notification bg-danger maskierung_'+k.id+'" hidden>OFF</span></button>')
                
                B.addClass('btn border border-5 btn_' + name.gruppe)
                B.addClass(class_)
                B.click(function(){
                  
                  // toggle(m.id, k.kanal_nr, 1- k.value )
                  
                  $.ajax({
                    url: "api/maskieren_toggle", //the page containing php script
                    type: "POST", //request type
                    dataType: 'json',
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify({
                      id: k.id
                      
                    }),
                    success:function(result){
                        console.log(result)
                        if (result.return == 0)
                          {$('.maskierung_'+k.id).attr('hidden','');}
                          else
                          {$('.maskierung_'+k.id).removeAttr('hidden');}
                        


                        
                      }
                      ,error: function(result){
                      console.log(result)

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






function szenelisteausgeben(DatenAusgabe, AusgabeID) {
  var container = $('#'+ AusgabeID);
  container.empty();
  if (container) {

      
      DatenAusgabe.forEach(function(m, i) {


      
          //################ Jede Zeile #################
      
            
            let s = $('<p></p>')
            s.html(m.ablauf_id + ' ' + m.szene + ' <i class="bi bi-arrow-right-short"></i>')
            if (m.ablauf_id == m.akt_ablauf)
            {s.css("background-color",localStorage.getItem('current_scene_color') )};
            

            s.click(function(){

              send('ablauf_produktion_gehezu', m.ablauf_id)
            })
            
          container.append(s)  
          

      });
  }
}

let defaultCurrent = '#00487d';
let defaultNext = '#008f00';
let defaultFollowing = '#424242';

async function checkStorage() {
    if (localStorage.getItem('current_scene_color') === null) {
        localStorage.setItem('current_scene_color', defaultCurrent);
    }

    if (localStorage.getItem('next_scene_color') === null) {
        localStorage.setItem('next_scene_color', defaultNext);
    }

    if (localStorage.getItem('following_scene_color') === null) {
        localStorage.setItem('following_scene_color', defaultFollowing);
    }
}

checkStorage();
