$(() => {
  const $form = $('.js-form');
  const $navPanel = $('.js-nav');
  const $imageSelect = $form.find('.js-select');
  const $imageAuthorSelect = $form.find('.js-author-select');
  const $image = $('.js-image');
  const $authorImage = $('.js-author-image');
  const itemId = $form.data('id');
  const prevImgPath = $imageSelect.data('prev-img');
  const prevAuthorImgPath = $imageAuthorSelect.data('prev-img');

  function readURL(input, $img) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        $img.attr('src', e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  $imageSelect.change(function(){
    readURL(this, $image);
  });

  $imageAuthorSelect.change(function(){
    readURL(this, $authorImage);
  });

  $navPanel.on('click', '.js-button', (e) => {
    const button = e.target;
    const action = $(button).data('type');

    switch (action) {
      case 'delete': {
        const sure = confirm('Are you sure?');
        console.log(itemId)

        if (sure) {
          $.ajax({
            url: `http://localhost:3001/news-editor/${itemId}`,
            type: 'DELETE',
            success: function(data){
              window.location.pathname = '/news-editor';
            }
          });
        }
        break;
      }
      case 'save': {
        $form.submit();
        break;
      }
      case 'return': {
        window.location.pathname = '/news-editor';
        break;
      }
      default: {
        console.log("no such command");
      }
    }
  })

  $form.on('submit', (e) => {
    e.preventDefault();
    console.log("submit");
    const fd = new FormData($form[0]);
    const image = $imageSelect[0].files[0];
    const authorImage = $imageAuthorSelect[0].files[0];

    const textEditor = $('#editor').find('.ql-editor').html();

    if (image) {
      fd.append('image', $imageSelect[0].files[0]);
    } else {
      fd.append('prevImage', prevImgPath);
    }

    if (authorImage) {
      fd.append('authorImage', $imageSelect[0].files[0]);
    } else {
      fd.append('prevAuthorImage', prevAuthorImgPath);
    }

    fd.append('content', textEditor);

    $.ajax({
      url: `http://localhost:3001/news-editor/${itemId}`,
      data: fd,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function(data){
        alert(JSON.stringify(data));
        window.location.pathname = '/news-editor';
      }
    });
  });

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'align': [] }]

    ['clean']                                         // remove formatting button
  ];
  const options = {
    modules: {
      toolbar: toolbarOptions
    },
    placeholder: 'Compose an epic...',
    theme: 'snow'
  };
  const editor = new Quill('#editor', options);
  const toolbar = editor.getModule('toolbar');

  toolbar.addHandler('image', imageHandler);
  function imageHandler() {
    const imgPath = '/images/blog/content/';
    const range = editor.getSelection();
    const value = prompt('Insert image name (i.e. image.jpg)');

    editor.insertEmbed(range.index, 'image', imgPath + value, Quill.sources.USER);
  }
});