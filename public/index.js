$(function() {

    hljs.configure({   // optionally configure hljs
        languages: ['javascript']
    });
    
    hljs.initHighlightingOnLoad();
    
    var quill = new Quill('#editor-container', {
        modules: {
            syntax: true,
            toolbar: [['code-block']]
        },
        theme: 'bubble'
    });
});
