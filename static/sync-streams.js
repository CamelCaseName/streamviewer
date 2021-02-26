var socket = io();

socket.on('connect', function() {
    socket.emit();
});

socket.on('stream_list', function(data) {
    console.log('Received stream list');
    var streamlist = JSON.parse(data["list"])
    updateStreamList(streamlist);
});

socket.on('stream_added', function(data) {
    console.log('Stream ' + data['key'] + ' added.');
    var streamlist = JSON.parse(data["list"])
    updateStreamList(streamlist);
});

socket.on('stream_removed', function(data) {
    console.log('Stream ' + data['key'] + ' removed.');
    var streamlist = JSON.parse(data["list"])
    updateStreamList(streamlist);
});



function extractStreamKey(e) {
  for (const c of e.classList){
    if (c.startsWith('stream-')) {
      return c.substring(7);
    }
  }
}

function hasStream(streamlist, k) {
  return streamlist.some(({ key }) => key === k);
}


/* Remove all active streams */
function updateStreamList(streamlist) {

  // Get the location for the streamlist
  var streams = document.querySelector("#streamlist");

  // Remove all streams that are not active anymore
  streams.querySelectorAll('.active_stream')
          .forEach(e => {
            var key = extractStreamKey(e);
            if (!hasStream(streamlist, key)) { e.remove() }
          });

  var existingStreams = [...streams.querySelectorAll('.active_stream')].map(e => extractStreamKey(e))

  // Add all streams from the streamlist that dont exist yet
  for (const stream of streamlist) {
    if (!existingStreams.includes(stream.key)) {
      // console.log("Streamlist had key "+stream.key+" so it was added");
      var li = document.createElement("li");
      li.classList.add("active_stream");
      li.classList.add("stream-"+stream.key);
      // TODO: Add password and description classes
      var a = document.createElement("a");
      a.href = "streams/"+stream.key;
      a.textContent = stream.key;
      li.appendChild(a);
      streams.appendChild(li);
    }
  }

  var existingStreams = Array.from(streams.querySelectorAll('.active_stream')).map(e => extractStreamKey(e))
  if (existingStreams.length > 0) {
    // If there are streams remove the "no streams"-message
    if (document.getElementById("no-stream-notice") !== null) { 
      document.getElementById("no-stream-notice").remove();
    }
  }else{
    // If there are no streams add a message
    var h2 = document.createElement("h2");
    h2.textContent = "There are currently no active streams"
    h2.id = "no-stream-notice";
    streams.appendChild(h2);
  }
}
