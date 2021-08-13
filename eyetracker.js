function PlotGaze(GazeData) {

    /*
      GazeData.state // 0: valid gaze data; -1 : face tracking lost, 1 : gaze uncalibrated
      GazeData.docX // gaze x in document coordinates
      GazeData.docY // gaze y in document cordinates
      GazeData.time // timestamp
    */
    
              /* This will be where the data is sent. Instead of accessing the element by id, GazeData.? will be sent to the database. */
              /* THis has been kept incase of troubleshooting */
//               document.getElementById("GazeData").innerHTML = "GazeX: " + GazeData.GazeX + " GazeY: " + GazeData.GazeY;
//               document.getElementById("HeadPhoseData").innerHTML = " HeadX: " + GazeData.HeadX + " HeadY: " + GazeData.HeadY + " HeadZ: " + GazeData.HeadZ;
//               document.getElementById("HeadRotData").innerHTML = " Yaw: " + GazeData.HeadYaw + " Pitch: " + GazeData.HeadPitch + " Roll: " + GazeData.HeadRoll;

              //this generates console log data for GazeData.GazeX! this means I can just send that data this way.
              //console.log("GazeX:" + GazeData.GazeX)
              // var send = { GazeX :GazeData.GazeX, GazeY:GazeData.GazeY, HeadX :GazeData.HeadX, HeadY: GazeData.HeadY, HeadZ: GazeData.HeadZ, Yaw: GazeData.HeadYaw, Pitch: GazeData.HeadPitch, Roll: GazeData.HeadRoll };
              // var options = {
              //        method: 'POST',
              //        headers:{
              //               'Content-Type': 'application/json'
              //        },
              //        body: JSON.stringify(send)
              // };
              // fetch ("/index", options).then((response) => response.json())
              // .then((data) => {console.log(data)})
              

              $(document).ready(function(){
                     $.ajax({
                       global: false,
                       type: 'POST',
                       url: "/eyetracking",
                       dataType: 'html',
                       data: {
                           GazeX: GazeData.GazeX,
                           GazeY: GazeData.GazeY,
                           HeadX: GazeData.HeadX,
                           HeadY: GazeData.HeadY,
                           HeadZ: GazeData.HeadZ,
                           Yaw: GazeData.HeadYaw,
                           Pitch: GazeData.HeadPitch,
                           Roll: GazeData.HeadRoll,
                           InnerHeight: window.innerHeight,
                           InnerWidth: window.innerWidth,
                           Game: 'Rubick',
                       },
                       success: function (result) {
                           console.log('Eyetracking Submitted');
                       },
                       error: function (request, status, error) {
                           serviceError();
                       }
                   });
                 });


              /* Only have 1 send request else calibration crashes*/

              //xhr.send('This request is working');
              //xhr.send(sendString);
           }
           
           //////set callbacks/////////
     
    
    window.addEventListener("load", function() {
       
              // below is code that shows eye position on screen.
           //GazeCloudAPI.OnCalibrationComplete =function(){ShowHeatMap(); console.log('gaze Calibration Complete')  }
           GazeCloudAPI.OnCamDenied =  function(){ console.log('camera  access denied')  }
           GazeCloudAPI.OnError =  function(msg){ console.log('err: ' + msg)  }
           GazeCloudAPI.UseClickRecalibration = true;
           GazeCloudAPI.OnResult = PlotGaze; 
           });
    
       
    
    function start()
    {
    
    document.getElementById("startid").style.display = 'none';
    document.getElementById("stopid").style.display = 'block';
    
    GazeCloudAPI.StartEyeTracking(); 
    
    if(false)
    GazeCloudAPI.SetFps(15);
    }
    
    function stop()
    {
    
    document.getElementById("startid").style.display = 'block';
    document.getElementById("stopid").style.display = 'none';
    GazeCloudAPI.StopEyeTracking();
    }
