
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
        
              
      
    }
    ,error: function(result){
      
      console.log(result);
    }           
  } );

}