$(document).ready(function () {

  const renderTweets = function(tweets) {
    const $tweetsContainer = $('.tweets-container');
    $tweetsContainer.empty();

    tweets.forEach(tweet => {
      const $tweet = createTweetElement(tweet);
      $tweetsContainer.prepend($tweet);
    });
  };

  const createTweetElement = function(tweet) {
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  return $(`
    <article class="tweet">
      <header>
        <div class="tweet-author">
          <img src="${escape(tweet.user.avatars)}" alt="Avatar">
          <span class="name">${escape(tweet.user.name)}</span>
        </div>
        <span class="handle">${escape(tweet.user.handle)}</span>
      </header>
      <p class="tweet-content">${escape(tweet.content.text)}</p>
      <footer>
        <span class="time">${timeago.format(tweet.created_at)}</span>
        <div class="tweet-actions">
          <i class="fa fa-flag"></i>
          <i class="fa fa-retweet"></i>
          <i class="fa fa-heart"></i>
        </div>
      </footer>
    </article>
  `);
};

  // *Ajax implement 1
  const loadTweets = () => {
  $.ajax({
    url: '/api/tweets', // GET request to your back-end
    method: 'GET',
    dataType: 'json',    // expect JSON array
    success: (tweets) => {
      renderTweets(tweets); // render all tweets to page
    },
    error: (err) => {
      console.error('Error fetching tweets:', err);
    }
  });
};

  $('form').on('submit', function (event) {
    event.preventDefault();

    const $form = $(this);
    const tweetText = $form.find('textarea').val();

    if (!tweetText || tweetText.length > 140) {
      alert("Tweet must be between 1 and 140 characters.");
      return;
    }

    // *Ajax implement 2
    $.ajax({
      url: '/api/tweets',
      method: 'POST',
      data: $form.serialize(),
      success: () => {
        $form.find('textarea').val('');
        $form.find('.counter').text(140);
        $('.new-tweet').slideUp();  // close compose box after successful post
        $('#compose-button').attr('aria-expanded', 'false');
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

  // Compose button toggle
  $('#compose-button').off('click').on('click', function () {
    const $compose = $('.new-tweet');
    if ($compose.is(':visible')) {
      $compose.slideUp(() => {
        $('#compose-button').attr('aria-expanded', 'false');
      });
    } else {
      $compose.slideDown(() => {
        $('textarea').focus();
        $('#compose-button').attr('aria-expanded', 'true');
      });
    }
  });

  // Load tweets on page load
  loadTweets();
});
