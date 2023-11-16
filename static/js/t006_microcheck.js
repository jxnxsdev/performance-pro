


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


setInterval(myTimer, 2000);

function myTimer() {
  microcheck_lesen()
}

microcheck_lesen()
g_fertig = 9999
function microcheck_lesen()
{
  $.ajax({
    url: "api/checkmenge", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({    }),
      success:function(result){
        let offen = 0, fertig = 0
        if (result.length == 2){
          if (result[0].microcheck == 0)offen = result[0].checkmenge + result[1].checkmenge
          if (result[1].microcheck == 0)offen = result[1].checkmenge + result[0].checkmenge
          if (result[0].microcheck == 1)fertig = result[0].checkmenge
          if (result[1].microcheck == 1)fertig = result[1].checkmenge
        }
        if (result.length == 1){
          if (result[0].microcheck == 0)offen = result[0].checkmenge 
          if (result[0].microcheck == 1)fertig = result[0].checkmenge
        }
        
        $("#checkmenge").html( "Check: " + fertig+ "/" + offen)
        
        if (fertig != g_fertig) kanaele_lesen()
        g_fertig = fertig 
       


        
      
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
          if (m.aktiv == 1)
          {
            let c = $('<div class="card" style="width: 90%; margin:20px"></div>')
            let cb = $('<div class="card-body"></div>')
            let ct = $('<h5 class="card-title"></h5>')
            
            ct.html("Kanal: "+m.id )
            
            
            cb.append(ct 
              ,$('<p class="card-text">'+m.beschreibung_1+ ' ' +m.beschreibung_2 +'</p>')
              
              ,$('<p class="card-text">Frequenz: '+m.frequenz+'</p>')
              
              // ,$('<p class="card-text">Maskiert: '+m.maskierung+'</p>')
              // ,$('<p class="card-text">Aktiv: '+m.aktiv+'</p>')
              )
              
              if (m.microcheck == 1)c.css("background-color",'#008f00');

              cb.click(function(){
                $.ajax({
                  url: "api/microcheck_toggle", //the page containing php script
                  type: "POST", //request type
                  dataType: 'json',
                  headers: { 'Content-Type': 'application/json' },
                  data: JSON.stringify({
                    id: m.id
                    
                  }),
                  success:function(result){
                    cardausgeben(result, "ausgabe")
                    console.log(result);
                      
                      
                    }
                    ,error: function(result){
                    console.log(result)

                  }    
                }) 
              })

            c.append(cb)

          container.append(c)  
            }

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