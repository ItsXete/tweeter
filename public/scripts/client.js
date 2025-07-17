$(document).ready(function () {

  const loadTweets = () => {
    $.ajax({
      url: '/tweets', 
      method: 'GET',
      success: (tweets) => {
        renderTweets(tweets);
      },
      error: (err) => {
        console.error('Error loading tweets:', err);
      }
    });
  };

  $('form').on('submit', function (event) {
    event.preventDefault(); 

    const $form = $(this);
    const tweetText = $form.find('textarea').val();

    // check tweet length
    if (!tweetText || tweetText.length > 140) {
      alert("Tweet must be between 1 and 140 characters.");
      return;
    }

    // send the tweet
    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: $form.serialize(), 
      success: () => {
        $form.find('textarea').val('');
        loadTweets();
      },
      error: (err) => {
        console.error('Tweet submission failed:', err);
      }
    });
  });

  $('textarea').on('input', function () {
    const remaining = 140 - $(this).val().length;
    const $counter = $(this).closest('form').find('.counter');
    $counter.text(remaining);

    if (remaining < 0) {
      $counter.addClass('over-limit');
    } else {
      $counter.removeClass('over-limit');
    }
  });

  $('#compose-button').on('click', function () {
    $('.new-tweet').slideToggle(() => {
      $('textarea').focus();
    });
  });

  // load the tweet
  loadTweets();
});