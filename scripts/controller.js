
$(document).ready(function() {
  var client = null;

  var topics = []

  disenableButton(true)
  function swapButton(addClass, removeClass, statusText, messageText, messageClass, messageRemove) {
    $("#conBtn").removeClass(removeClass)
    $("#conBtn").addClass(addClass)
    $(".status").text(statusText)
    $("#text").text(messageText)
    $(".message").addClass(messageClass)
    $(".message").removeClass(messageRemove)
  }
  function disenableButton(action) {
    $(".btn-publish").attr("disabled", action)
    $(".btn-subscribe").attr("disabled", action)
    $(".btn-unsubscribe").attr("disabled", action)
  }
  function addSelect() {
    $("select").empty();
    var opt = new Option("Select a topic to Unscubscribe", "")
    $('select').append($(opt).attr({
      disabled: true,
      selected: true
    }));

    for (let i = 0; i < topics.length; i++) {
      var opt = new Option(topics[i], topics[i])
      $('select').append($(opt).attr("class", "item"));
    }
  }
  $("#conBtn").click(function() {
    var timestamp = null;
    var address = $("#address").val();
    var btn = $(this)
    if ($(btn).attr("class").includes("positive")) {
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
          disenableButton(false)
          swapButton("btn-disconnect negative", "btn-connect positive", "Connected", "Disconnect", "green", "red")
        })
      }
      // publish
      $(".btn-publish").click(function() {
        var my_payload = $("#payload").val();
        var my_topic = $("#topic").val();
        if (my_payload == "" || my_topic == "") {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Please add a Topic or/and a Payload!',
          });
        } else {
          client.publish(my_topic, my_payload)
          timestamp = moment().format('MMMM D YYYY , h:mm:ss a')
          Swal.fire({
            type: 'success',
            title: 'Success...',
            text: 'Topic Successfully Published!',
          });
        }
      });
      // subscribe
      $(".btn-subscribe").click(function() {
        var topic_s = $("#topic_s").val();
        if (topic_s == "") {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Please add a Topic to Subscribe',
          });
        } else {
          if (topics.includes(topic_s)) {
            Swal.fire({
              type: 'info',
              title: 'Topic already subscribed'
            });
          } else {
            topics.push(topic_s);
            addSelect()
            Swal.fire({
              type: 'success',
              title: 'Success...',
              text: topic_s + ' Successfully Subscribed!',
            });
            client.subscribe(topic_s);
          }
        }
      });

      // unsubscibe
      $(".btn-unsubscribe").click(function() {
        var removeTopic = $("select").val();
        if (removeTopic != null) {
          client.unsubscribe(removeTopic);
          topics.splice($.inArray(removeTopic, topics), 1);
          addSelect()

          Swal.fire({
            type: 'success',
            title: 'Unsubscribed successfully'
          });
        } else {
          Swal.fire({
            type: 'error',
            title: 'Please select a Topic to Unscubscribe.'
          });
        }
      })
      // message
      client.on("message", function(topic, payload) {
        var tr = $("<tr>")
        $("<td>").text(topic).appendTo($(tr))
        $("<td>").text(payload).appendTo($(tr))
        $("<td>").text(timestamp).appendTo($(tr))
        $("tbody").append($(tr))
        $("#notif").addClass("red")
      })
    } else {
      disenableButton(true)
      swapButton("btn-connect positive", "btn-disconnect negative", "Disonnected", "Connect", "red", "green")
      client.end();
    }
  })

  $("#notif").click(function() {
    $("#notif").removeClass("red")
    $('.ui.modal').modal('show')
  })
});
