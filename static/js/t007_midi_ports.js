ports_lesen()


function ports_lesen()
{
  $.ajax({
    url: "api/midi_ports", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
        
    }),
      success:function(result){
        console.log(result);
        cardausgeben(result, "ausgabe")
       


        
      
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


        console.log(m)
          //################ Jede Zeile #################


          let a
          if (m.aktiv){
            a = $('<i class="fas fa-bell"></i><span class="badge rounded-pill badge-notification bg-danger">aktiv</span>')
          }
          else
          { a = $('')}

            let c = $('<div class="card" style="width: 90%; margin:20px"></div>')
            let cb = $('<div class="card-body"></div>')
            let ct = $('<h5 class="card-title"></h5>')
            
            ct.html("Port: "+m.id )
            
            
            cb.append(ct 
              ,$('<p class="card-text">'+m.port +'</p>')
              
              ,a
              )
              
              cb.click(function(){
                $.ajax({
                  url: "api/midi_ports_select", //the page containing php script
                  type: "POST", //request type
                  dataType: 'json',
                  headers: { 'Content-Type': 'application/json' },
                  data: JSON.stringify({
                    id: m.id
                    ,port: m.port
                    
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