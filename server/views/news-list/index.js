$(() => {
  const $postsList = $('.js-posts-list');
  const $navPanel = $('.js-nav');

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

  $postsList.on('click', '.js-post', (e) => {
    const post = e.currentTarget;
    const id = $(post).data('id');
    window.location.pathname = `/news-editor/${id}`;
  });

  $navPanel.on('click', '.js-button', (e) => {
    const button = e.target;
    const action = $(button).data('type');
    const $item = $(button).closest('.js-container');
    const itemId = $item.data('id');

    switch (action) {
      case 'edit': {
        window.location.pathname = `/news-editor/${itemId}`;
        break;
      }
      case 'add': {
        window.location.pathname = `/news-editor/add`;
        break;
      }
      case 'save': {
        const $content = $('.js-posts-preview');
        const $contentCopy = $content.clone();
        const $slider = $contentCopy.find('.js-posts-slider');
        const $imgLazyLoad = $contentCopy.find('.js-img-lazy');

        $imgLazyLoad.each((i, img) => {
          const src = $(img).attr('src');
          $(img).removeAttr('src').attr('data-src', src);
        });

        $contentCopy.find('.js-post-content').removeAttr('data-post-content');
        $slider.css('visibility', 'hidden');
        const content = $contentCopy.html();

        $.ajax({
          url: `http://localhost:3001/news-editor/save`,
          data: JSON.stringify({news: content}),
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          processData: false,
          type: 'POST',
          success: function(data) {
            $slider.css('visibility', 'visible');
            message(data);
          },
          error: function (xhr) {
            message("status: " + xhr.status + ", message: " + xhr.responseText, 'fail');
          }
        });

        break;
      }
      case 'return': {
        window.location.pathname = `/`;
        break;
      }
      default: {
        message("no such command", "error");
      }
    }
  })
});