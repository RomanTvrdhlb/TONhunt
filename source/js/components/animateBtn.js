    const buttons = document.querySelectorAll('.main-btn');
  
    buttons && buttons.forEach(function(button) {
      button.addEventListener('mouseenter', function(e) {
        const parentOffset = getOffset(this),
              relX = e.pageX - parentOffset.left,
              relY = e.pageY - parentOffset.top;
        
        const span = this.querySelector('span');
        if(span){
          span.style.top = relY + 'px';
          span.style.left = relX + 'px';
        }
      });
  
      button.addEventListener('mouseout', function(e) {
        const parentOffset = getOffset(this),
              relX = e.pageX - parentOffset.left,
              relY = e.pageY - parentOffset.top;
  
        const span = this.querySelector('span');
        if(span){
          span.style.top = relY + 'px';
          span.style.left = relX + 'px';
        }
      });
    });
  
    function getOffset(el) {
      const rect = el.getBoundingClientRect();
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
    }
