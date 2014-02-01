(function() {
  var root = shadowWrap.createWrapper();

  function createDragon(offset) {
    return $("<img>", {
      src: chrome.extension.getURL("images/dragon.png"),
      class: "dragon",
    }).css(offset || {});
  }

  function loadData(key) {
    var data = JSON.parse(localStorage.getItem("D-DROP"));
    if (!data) {
      data = { dragons: [] };
      saveData(null, data);
    }
    return (typeof key === "string") ? data[key] : data;
  }

  function saveData(key, value) {
    var data = value;
    if (typeof key === "string") {
      data = loadData();
      data[key] = value;
    }
    localStorage.setItem("D-DROP", JSON.stringify(data));
  }

  function init($dom) {
    var $overlay = $dom.find(".overlay");

    // Load dragons
    $.fn.append.apply($overlay, loadData("dragons").map(createDragon));

    function saveDragons() {
      var dragons = $overlay.find(".dragon").map(function() {
        return $(this).offset();
      }).toArray();
      saveData("dragons", dragons);
    }

    // Bind events
    $dom.on("mousedown", ".dragon", function(e) {
      var $dragon = $(this),
          offset = $dragon.offset(),
          dragEvents = {
            mousemove: moveDragon,
            mouseup: dropDragon
          };

      offset.top -= e.pageY;
      offset.left -= e.pageX;
      
      function moveDragon(e) {
        $dragon.offset({
          top: e.pageY + offset.top,
          left: e.pageX + offset.left
        });
      }

      function dropDragon(e) {
        saveDragons();
        $overlay.off(dragEvents).css("pointer-events", "none");
      }

      $overlay.on(dragEvents).css("pointer-events", "auto");
      e.preventDefault();
    });

    $dom.on("click", ".add-dragon", function() {
      $overlay.append(createDragon({
        top: $(window).scrollTop(),
        left: 0
      }));
      saveDragons();
    });

  }

  function getResource(url) {
    return $.ajax({ url: chrome.extension.getURL(url) });
  }

  var markupRequest = getResource("partials/d-drop.html").then(function(markup) {
    var $dom = $(markup);
    init($dom);
    $dom.appendTo(root.shadowRoot);
  });

  var cssRequest = getResource("css/d-drop.css").then(function(css) {
    $("<style>").append(css).appendTo(root.shadowRoot);
  });

  var fontRequest = $.Deferred(function() {
    $("<link href='//fonts.googleapis.com/css?family=Coming+Soon' rel='stylesheet' type='text/css'>")
      .on("load", this.resolve)
      .appendTo(document.head);
  });

  $.when(markupRequest, cssRequest, fontRequest).then(function() {
    $(root.wrapper).appendTo(document.body);
  });

}())