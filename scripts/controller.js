
$(document).ready(function () {
  $('body').bootstrapMaterialDesign();
  var client = null;
  $(".btn-disconnect").attr("disabled", true);
  // $(".btn-unsubscribe").attr("disabled", true);

  $(".btn-connect").click(function () {
    var address = $("#address").val();
    var timestamp = null;

    if (address == "") {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Please add a broker address to connect..',
      });
    } else {
      connect = true;
      client = mqtt.connect(address);
      $(".status").text("connecting...")
      client.on("connect", function () {
        Swal.fire({
          type: 'success',
          title: 'Connected Successfilly!'
        });
        $(".status-bar").removeClass("alert-secondary");
        $(".status-bar").addClass("alert-success");
        $(".status").text("connected")
        $(".btn-disconnect").attr("disabled", false);
      })
    }

    $(".btn-disconnect").click(function () {
      client.end();
      $(".status-bar").removeClass("alert-success");
      $(".status-bar").addClass("alert-secondary");
      $(".status").text("Disconnected")
      $(".btn-disconnect").attr("disabled", true);
    });

    $(".btn-publish").click(function () {
      var my_payload = $("#payload").val();
      var my_topic = $("#topic").val();
      if (my_payload == "" || my_topic == "") {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Please add a Topic or/and a Payload!',
        });
      } else {
        client.publish(my_topic, my_payload, function () {
          // var timeAdded = new Date;
          // timestamp = timeAdded.getDay() + '-' + (timeAdded.getMonth() + 1) + '-' + timeAdded.getFullYear() + " " + timeAdded.getHours() + ":" + timeAdded.getMinutes() + ":" + timeAdded.getSeconds()
          timestamp = moment().format('MMMM Do YYYY, h:mm:ss a')
        })
        Swal.fire({
          type: 'success',
          title: 'Success...',
          text: 'Topic Successfully Published!',
        });
      }
    });

    $(".btn-subscribe").click(function () {
      var topic_s = $("#topic_s").val();
      if (topic_s == "") {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Please add a Topic to Subscribe',
        });
      } else {
        Swal.fire({
          type: 'success',
          title: 'Success...',
          text: topic_s + ' Successfully Subscribed!',
        });
        // $(".btn-unsubscribe").attr("disabled", false);

        client.subscribe( topic_s);
      }
    });

    client.on("message", function (topic, payload) {
      var tr = $("<tr>")
      $("<td>").text(topic).appendTo($(tr))
      $("<td>").text(payload).appendTo($(tr))
      $("<td>").text(timestamp).appendTo($(tr))
      $("tbody").append($(tr))
      console.log($(tr).html())
      console.log([topic, payload].join(": "));
    })
  })




  // ws://broker.hivemq.com:8000/mqtt





  // // advance functionalities
  // client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt")
  // client.subscribe("mqtt/demo")

  // client.on("connect", function(){
  //     console.log("Successfully connected");
  // })

  // client.on("message", function (topic, payload) {
  //   console.log([topic, payload].join(": "));
  //   client.end();
  // })

  // client.publish("mqtt/demo", "hello world!", function(err){
  //   if (err){
  //     console.log(err)
  //   } else {
  //     console.log("published")
  //   }
  // })
});
