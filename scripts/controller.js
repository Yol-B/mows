
$(document).ready(function() {
  var client = null;
  var connected = false;
  var topics = []

  $(".btn-connect").click(function() {
    if (address == "") {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Please add a broker address to connect..',
      });
    } else {
      $(".status").text("connecting...")
      client = mqtt.connect(address);
      client.on("connect", function() {
        Swal.fire({
          type: 'success',
          title: 'Connected Successfilly!'
        });
        $("#conBtn").removeClass("btn-connect positive")
        $("#conBtn").addClass("wifi btn-disconnect negative")
        $("#text").text("Disconnect")
        $(".status").text("Connected")
        $(".message").addClass("green")
        connected = true;
      })
    }
  })
});
