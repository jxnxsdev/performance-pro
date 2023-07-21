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

function save(id,midi_kanal,midi_befehl,maskierung,frequenz,beschreibung_1,beschreibung_2, gruppe, aktiv)
{
  
  $.ajax({
    url: "api/kanal_save", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
                id: id
                , midi_kanal: midi_kanal
                , maskierung: maskierung
                , midi_befehl: midi_befehl
                , frequenz: frequenz
                , beschreibung_1: beschreibung_1
                , beschreibung_2: beschreibung_2
                , gruppe: gruppe
                , aktiv: aktiv


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
            
            ct.html("Kanal: "+m.id + '<i class="bi bi-pen"></i>')
            ct.click(function(){
              cb.empty()
              
              let k = $('<h5></h5>')
              k.html('Kanal: ' + m.id)

              let b1l = $('<label for="beschreibung_1" class="form-label">Beschreibung:</label>')
              let b1 = $('<input type="text" class="form-control" id="beschreibung_1" name="beschreibung_1">')
              b1.val(m.beschreibung_1)
              
              let b2l = $('<label for="beschreibung_2" class="form-label">Beschreibung 2:</label>')
              let b2 = $('<input type="text" class="form-control" id="beschreibung_2" name="beschreibung_2">')
              b2.val(m.beschreibung_2)

              let mbl = $('<label for="midi_befehl" class="form-label">Midi Kanal:</label>')
              let mb = $('<input type="text" class="form-control" id="midi_befehl" name="midi_befehl">')
              mb.val(m.midi_befehl)

              let mkl = $('<label for="midi_kanal" class="form-label">Midi Befehl:</label>')
              let mk = $('<input type="number" class="form-control" id="midi_kanal" name="midi_kanal">')
              mk.val(m.midi_kanal)

              let fl = $('<label for="frequenz" class="form-label">Frequenz</label>')
              let f = $('<input type="text" class="form-control" id="frequenz" name="frequenz">')
              f.val(m.frequenz)
              let div = $('<div class="form-check form-switch"></div')
              let ma = $('<input class="form-check-input" type="checkbox" role="switch" id="maskierung">')
              let mal = $('<label class="form-check-label" for="maskierung">Kanal Maskiert</label>')
              int_to_on(m.maskierung, ma)
              div.append(mal,ma)


              let gl= $('<label for="gruppe" class="form-label">Gruppe:</label>')
              let g = $('<input type="number" class="form-control" id="gruppe" name="gruppe" min="1" max="16">')
              g.val(m.gruppe)

              let div1 = $('<div class="form-check form-switch"></div')
              let ma1 = $('<input class="form-check-input" type="checkbox" role="switch" id="aktiv">')
              let mal1 = $('<label class="form-check-label" for="aktiv">Kanal aktiv</label>')
              int_to_on(m.aktiv, ma1)
              div1.append(mal1,ma1)

              let B = $('<button type="submit" class="btn btn-primary">Save</button>')
              B.click(function(){
                save(m.id, mk.val(),mb.val(),switch_to_int(ma),f.val(),b1.val(),b2.val(), g.val(), switch_to_int(ma1))
                
              })
              cb.append(k,b1l, b1, b2l, b2, mbl,mb, mkl,mk,fl, f,div, gl,g, div1, $('<br>'), B)
            })

            let cont = $('<p class="card-text"></p>')
            cont.text('Midi Kanal: '+m.midi_kanal + ' Midi Befehl: '+m.midi_befehl)
            
            cb.append(ct, cont 
              ,$('<p class="card-text">'+m.beschreibung_1+ ' ' +m.beschreibung_2 +'</p>')
              
              ,$('<p class="card-text">Frequenz: '+m.frequenz+'</p>')
              
              // ,$('<p class="card-text">Maskiert: '+m.maskierung+'</p>')
              // ,$('<p class="card-text">Aktiv: '+m.aktiv+'</p>')
              )
            
              if (m.aktiv == 1)c.css("background-color",'#008f00');
            c.append(cb)

          container.append(c)  
          

      });
  }
}


function int_to_on(x,obj){
  if (x == 1)
  {obj.attr("checked",true)}
  else
  {obj.attr("checked",false)}
}

function switch_to_int(obj){
  
  if($(obj).prop('checked'))
  {return 1}
  else
  {return 0}
}