
setInterval(myTimer, 2000);

function myTimer() {
  microcheck_lesen()
}

microcheck_lesen()

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
        if (result["microcheck"].length == 2){
          if (result["microcheck"][0].microcheck == 0)offen = result["microcheck"][0].checkmenge + result["microcheck"][1].checkmenge
          if (result["microcheck"][1].microcheck == 0)offen = result["microcheck"][1].checkmenge + result["microcheck"][0].checkmenge
          if (result["microcheck"][0].microcheck == 1)fertig = result["microcheck"][0].checkmenge
          if (result["microcheck"][1].microcheck == 1)fertig = result["microcheck"][1].checkmenge
        }
        if (result["microcheck"].length == 1){
          if (result["microcheck"][0].microcheck == 0){offen = result["microcheck"][0].checkmenge ;  }
          if (result["microcheck"][0].microcheck == 1){
            fertig = result["microcheck"][0].checkmenge; 
            offen = result["microcheck"][0].checkmenge;

          }

          
        }
        
        $("#checkmenge").html( "Check: " + fertig+ "/" + offen)
        
              
      
    }
    ,error: function(result){
      
      console.log(result);
    }           
  } );

}