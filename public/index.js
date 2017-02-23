$(function() {
  var quill = new Quill('#editor-container', {
    modules: {
      toolbar: [
        [{
          header: [1, 2, false]
        }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block']
    ]},
    theme: 'bubble'
  });
});
