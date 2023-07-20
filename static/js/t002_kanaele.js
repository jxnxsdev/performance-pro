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
kanaele_lesen()


function kanaele_lesen()
{
  $.ajax({
    url: "api/kanaele", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
        func: 'T002_kanaele'
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

function save(id,kanal_nr,midi_kanal)
{
  
  $.ajax({
    url: "api/kanal_save", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
                id: id, kanal_nr: kanal_nr, midi_kanal: midi_kanal
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
            
            ct.html("Kanal: "+m.kanal_nr + '<i class="bi bi-pen"></i>')
            ct.click(function(){
              let kl= $('<label for="kanal" class="form-label">Kanal:</label>')
              let k = $('<input type="number" class="form-control" id="kanal" name="kanal">')
              k.val(m.kanal_nr)
              let mkl = $('<label for="midi_kanal" class="form-label">Midi Kanal:</label>')
              let mk = $('<input type="number" class="form-control" id="midi_kanal" name="midi_kanal">')
              mk.val(m.midi_kanal)
              let B = $('<button type="submit" class="btn btn-primary">Save</button>')
              B.click(function(){
                save(m.id, k.val(),mk.val())
                
              })
              cb.append(kl,k,mkl,mk,B)
            })

            let cont = $('<p class="card-text"></p>')
            cont.text('Midi Kanal: '+m.midi_kanal)
            
            cb.append(ct, cont)
            
            c.append(cb)

          container.append(c)  
          

      });
  }
}


