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
besetzung_lesen()


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
        cardausgeben(result, "ausgabe")
        console.log(result);
       


        
      
    }
    ,error: function(result){
      
      console.log(result);
    }           
  } );

}

function neu()
{
  $.ajax({
    url: "api/besetzung_neu", //the page containing php script
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

function save(id,kanal_nr,beschreibung_1,beschreibung_2)
{
  
  $.ajax({
    url: "api/besetzung_save", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
                id: id
                , kanal_nr: kanal_nr
                , beschreibung_1: beschreibung_1
                , beschreibung_2: beschreibung_2
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

function cardausgeben(DatenAusgabe, AusgabeID) {
  var container = $('#'+ AusgabeID);
  container.empty();
  if (container) {

      
      DatenAusgabe.forEach(function(m, i) {


      
          //################ Jede Zeile #################
      
            let c = $('<div class="card" style="width: 18rem; margin:20px"></div>')
            let cb = $('<div class="card-body"></div>')
            let ct = $('<h5 class="card-title"></h5>')
            
            ct.html("Kanal: "+m.kanal_nr + ' ' + m.beschreibung_1 + ' <i class="bi bi-pen"></i>')
            ct.click(function(){
              cb.empty()
              let kl= $('<label for="kanal" class="form-label">Kanal:</label>')
              let k = $('<input type="number" class="form-control" id="kanal" name="kanal">')
              k.val(m.kanal_nr)

              let b1l = $('<label for="beschreibung_1" class="form-label">Beschreibung 1:</label>')
              let b1 = $('<input type="text" class="form-control" id="beschreibung_1" name="beschreibung_1">')
              b1.val(m.beschreibung_1)
              
              let b2l = $('<label for="beschreibung_2" class="form-label">Beschreibung 2:</label>')
              let b2 = $('<input type="text" class="form-control" id="beschreibung_2" name="beschreibung_2">')
              b2.val(m.beschreibung_2)
              
              
              let B = $('<button type="submit" class="btn btn-primary">Save</button>')
              B.click(function(){
                save(m.id, k.val(),b1.val(), b2.val())
                
              })
              cb.append(kl,k,b1l,b1, b2l, b2,  B)
            })

            let cont = $('<p class="card-text"></p>')
            cont.text(m.beschreibung_2)
            
            cb.append(ct, cont)
            
            c.append(cb)

          container.append(c)  
          

      });
  }
}


