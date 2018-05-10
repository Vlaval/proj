$(() => {
  const $form = $('.js-form');
  const $navPanel = $('.js-nav');
  const $imageSelect = $form.find('.js-select');
  const $imageAuthorSelect = $form.find('.js-author-select');
  const $image = $('.js-image');
  const $authorImage = $('.js-author-image');
  const itemId = $form.data('id');

  function message(text, result, cb) {
    const $container = $('.js-message');
    $container.text(text);
    if (result === "fail") {
      $container.addClass("message--error");
    } else {
      $container.addClass("message--success")
    }
    setTimeout(() => {
      $container.removeClass("message--success").removeClass("message--error");
      $container.text('');
      cb && cb();
    }, 3000);
  }

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

        if (sure) {
          $.ajax({
            url: `http://localhost:3001/news-editor/${itemId}`,
            type: 'DELETE',
            success: function(data) {
              message(data, 'success', () => window.location.pathname = '/news-editor');
            },
            error: function (xhr) {
              message("status: " + xhr.status + ", message: " + xhr.responseText, 'fail');
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
  });

  $form.on('submit', (e) => {
    e.preventDefault();
    const fd = new FormData($form[0]);
    const textEditor = $('#editor').find('.ql-editor').html();

    fd.append('content', textEditor);

    $.ajax({
      url: `http://localhost:3001/news-editor/${itemId}`,
      data: fd,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function(data){
        message(data, 'success', () => window.location.pathname = '/news-editor');
      },
      error: function (xhr) {
        message("status: " + xhr.status + ", message: " + xhr.responseText, 'fail');
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
    const $modal = $('.js-content-image-modal');
    const $modalInput = $modal.find('.js-content-image-input');
    const $modalForm = $modal.find('.js-add-image-form');
    let filename = '';

    function showModal() {
      $('html, body').css({
        overflow: 'hidden',
        height: '100%'
      });
      $modal.addClass('content-image-modal--visible');
    }

    function hideModal() {
      $modal.removeClass('content-image-modal--visible');
      $('html, body').css({
        overflow: 'auto',
        height: 'auto'
      });
    }

    showModal();

    $modalInput.change(function (){
      filename = $(this).val().split('\\').pop();
    });

    $modalForm.on('submit', (e) => {
      e.preventDefault();
      if ($modalInput.val()) {
        const fd = new FormData($modalForm[0]);

        $.ajax({
          url: `http://localhost:3001/news-editor/save-image`,
          data: fd,
          processData: false,
          contentType: false,
          type: 'POST',
          success: function(data) {
            message(data);
            hideModal();
            editor.insertEmbed(range.index, 'image', imgPath + filename, Quill.sources.USER);
          },
          error: function (xhr) {
            message("status: " + xhr.status + ", message: " + xhr.responseText, 'fail');
          }
        });
      }
    });

    $modal.on('click', (e) => {
      if ($(e.target).hasClass('js-content-image-modal')) hideModal();
    })
  }
});