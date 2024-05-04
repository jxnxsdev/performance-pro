
stueke_lesen()


function stueke_lesen()
{
  $.ajax({
    url: "api/stuecke", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
        func: 'T001_select'
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
    url: "api/stueckerzeugen", //the page containing php script
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

function save(id,beschreibung_1,beschreibung_2,jahr)
{
  
  $.ajax({
    url: "api/stueck_save", //the page containing php script
    type: "POST", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
                id: id, beschreibung_1: beschreibung_1, beschreibung_2: beschreibung_2, jahr: jahr
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

function stueck_delete(id)
{
  
  $.ajax({
    url: "api/stueck_delete", //the page containing php script
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

function stueck_sicherung(id)
{
  
  $.ajax({
    url: "api/stueck_sicherung", //the page containing php script
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

function reload()
{
  
  $.ajax({
    url: "api/stueck_reload", //the page containing php script
    type: "GET", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },

      success:function(result){
        //cardausgeben(result, "ausgabe")
        console.log(result);      


        $("#ausgabe").empty()
        result.forEach(function(m, i) {
        $("#ausgabe").append(
          $("<button></button>").text(m).addClass("btn btn-primary").css("margin-top","20px").click(function(){

            $.ajax({
              url: "api/stueck_reload", //the page containing php script
              type: "POST", //request type
              dataType: 'json',
              headers: { 'Content-Type': 'application/json' },
              data: JSON.stringify({file : m
                             }),
                success:function(result){
                  cardausgeben(result, "ausgabe")
                }})
          })
        )
        })

    }
    ,error: function(result){
      
      console.log(result);
    }           
  } );

}

function reload_from_save()
{
  
  $.ajax({
    url: "api/stueck_reload_from_save", //the page containing php script
    type: "GET", //request type
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },

      success:function(result){
        //cardausgeben(result, "ausgabe")
        console.log(result);      


        $("#ausgabe").empty()
        result.forEach(function(m, i) {
        $("#ausgabe").append(
          $("<button></button>").text(m).addClass("btn btn-primary").css("margin-top","20px").click(function(){

            $.ajax({
              url: "api/stueck_reload_from_save", //the page containing php script
              type: "POST", //request type
              dataType: 'json',
              headers: { 'Content-Type': 'application/json' },
              data: JSON.stringify({file : m
                             }),
                success:function(result){
                  cardausgeben(result, "ausgabe")
                }})
          })
        )
        })

    }
    ,error: function(result){
      
      console.log(result);
    }           
  } );

}


function stueckauswahl(id)
{
  console.log("stueckauswahl id:" + id )
  $.ajax({
    url: "/api/stueckauswahl", //the page containing php script
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

function cardausgeben(DatenAusgabe, AusgabeID) {
  var container = $('#'+ AusgabeID);
  container.empty();
  if (container) {

      
      DatenAusgabe.forEach(function(m, i) {



//################ Jede Zeile #################
      
let c = $('<div class="card" style="width: 18rem; margin:20px"></div>')
let cb = $('<div class="card-body"></div>')
let ct = $('<h5 class="card-title"></h5>')
let a
if (m.aktiv){
  a = $('<i class="fas fa-bell"></i><span class="badge rounded-pill badge-notification bg-danger">aktiv</span>')
}
else
{ a = $('')}
ct.html(m.beschreibung_1 + '<i class="bi bi-pen"></i>')
ct.click(function(){
  cb.empty()
  let b1l= $('<label for="beschreibung_1" class="form-label">Beschreibung:</label>')
  let b1 = $('<input type="text" class="form-control" id="beschreibung_1" name="beschreibung_1">')
  b1.val(m.beschreibung_1)
  let b2l = $('<label for="beschreibung_2" class="form-label">Beschreibung 2:</label>')
  let b2 = $('<input type="text" class="form-control" id="beschreibung_2" name="beschreibung_2">')
  b2.val(m.beschreibung_2)
  let jl = $('<label for="jahr" class="form-label">Jahr:</label>')
  let j = $('<input type="number" class="form-control" id="jahr" name="jahr">')
  j.val(m.jahr)

  let B = $('<button></button>').text('Save').addClass("btn btn-primary").css('margin-right','10px').css("margin-top", "20px")
  B.click(function(){
    save(m.id, b1.val(),b2.val(),j.val())
    
  })

  let D = $('<button></button>').text('Archiv').addClass("btn btn-danger").css('margin-right','10px').css("margin-top", "20px")
  D.click(function(){
    stueck_delete(m.id)
    
  })
  
  let S = $('<button></button>').text('Sichern').addClass("btn btn-warning").css('margin-right','10px').css("margin-top", "20px")
  S.click(function(){
    stueck_sicherung(m.id)
    
  })
  cb.append(b1l,b1,b2l,b2,jl,j,B,D,S)
})

let cont1 = $('<p class="card-text">'+m.beschreibung_2+'</p>')
let cont2 = $('<p class="card-text">Jahr'+m.jahr+'</p>')
let B_aus = $('<button type="submit" class="btn btn-secondary">Auswahl</button>')
B_aus.click(function(){
  stueckauswahl(m.id)
  $('#aktuelles_Stueck_txt').html(m.beschreibung_1)
})
cb.append(a,ct, cont1,cont2,B_aus)

c.append(cb)

container.append(c)  



      
      });
  }
}


