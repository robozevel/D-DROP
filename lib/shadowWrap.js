var shadowWrap = (function() {
  var createShadowRoot = Element.prototype.createShadowRoot || Element.prototype.webkitCreateShadowRoot;

  function createWrapper(content) {
    var wrapper = document.createElement("shadow-wrap");
    var shadowRoot = createShadowRoot.call(wrapper);
    wrapper.resetStyleInheritance = true;

    switch (typeof content) {
      case "string":
        shadowRoot.innerHTML = content;
        break;
      case "object":
        if (content instanceof Node) shadowRoot.appendChild(content);
        break;
    }

    return {
      wrapper: wrapper,
      shadowRoot: shadowRoot
    };
  }

  return {
    createWrapper: createShadowRoot ? createWrapper : function() { console.warn("shadowRoot not supported"); }
  };

}());