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
      
            let c = $('<div class="card" style="width: 32%; margin:20px"></div>')
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
              let b1l = $('<label for="beschreibung_1" class="form-label">Beschreibung:</label>')
              let b1 = $('<input type="text" class="form-control" id="beschreibung_1" name="beschreibung_1">')
              b1.val(m.beschreibung_1)
              let b2l = $('<label for="beschreibung_2" class="form-label">Beschreibung 2:</label>')
              let b2 = $('<input type="text" class="form-control" id="beschreibung_2" name="beschreibung_2">')
              b2.val(m.beschreibung_2)
              let B = $('<button type="submit" class="btn btn-primary">Save</button>')
              B.click(function(){
                save(m.id, b1l,b1,b2l, b2, k.val(),mk.val())
                
              })
              cb.append(kl,k,mkl,mk,B)
            })

            let cont = $('<p class="card-text"></p>')
            cont.text('Midi Kanal: '+m.midi_kanal)
            
            cb.append(ct, cont 
              ,$('<p class="card-text">'+m.beschreibung_1+'</p>')
              ,$('<p class="card-text">'+m.beschreibung_2+'</p>')
              ,$('<p class="card-text">Frequenz: '+m.frequenz+'</p>')
              ,$('<p class="card-text">Midi Befehl: '+m.midi_befehl+'</p>')
              ,$('<p class="card-text">ON/OFF: '+m.maskierung+'</p>')
              )
            
            c.append(cb)

          container.append(c)  
          

      });
  }
}


