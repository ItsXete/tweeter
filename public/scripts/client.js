$(document).ready(function () {
  const $error = $('.error-message');
$error.text('').hide();

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

  // Ajax GET tweets
  const loadTweets = () => {
    $.ajax({
      url: '/api/tweets',
      method: 'GET',
      success: (tweets) => {
        renderTweets(tweets);
      },
      error: (err) => {
        console.error('Error fetching tweets:', err);
        // Optional: show a page-wide error message here if desired
      }
    });
  };

  // Form validation
  $('form').on('submit', function (event) {
  event.preventDefault();

  const $form = $(this);
  const tweetText = $form.find('textarea').val().trim(); // Trim spaces
  const $error = $form.find('.error-message'); // Scope error message within form

  // Hide err func
  $error.slideUp().text('');

  // Validation with alert (per requirement)
  if (!tweetText) {
    $error.text("Tweet empty. Just like head.").slideDown();
    return;
  }

  if (tweetText.length > 140) {
    $error.text("Too much thinking, shutting off.").slideDown();
    return;
  }

  // Proceed with submission
  $.ajax({
    url: '/api/tweets',
    method: 'POST',
    data: $form.serialize(),
    success: () => {
      $form.find('textarea').val('');
      $form.find('.counter').text(140);
      $('.new-tweet').slideUp();
      $('#compose-button').attr('aria-expanded', 'false');
      $error.slideUp();
      loadTweets();
    },
    error: (err) => {
      console.error('Tweet submission failed:', err);
      $error.text("Failed to submit tweet. Please try again.").slideDown();
    }
  });
});

  // Counter update
  $('textarea').on('input', function () {
  const maxChars = 140;
  const currentLength = $(this).val().length;
  const charsLeft = maxChars - currentLength;

  const $counter = $(this).closest('form').find('.counter');
  const $error = $(this).closest('form').find('.error-message');

  $counter.text(charsLeft);

  if (charsLeft < 0) {
    $counter.addClass('over-limit');
    $error.text("Too much thinking, shutting off.").slideDown();
  } else {
    $counter.removeClass('over-limit');
    $error.slideUp().text('');
  }
});

  // Compose button toggle
$('#compose-button').off('click').on('click', function () {
  const $compose = $('.new-tweet');
  const $error = $compose.find('.error-message');  // find error-message inside form

  if ($compose.is(':visible')) {
    $compose.slideUp(() => {
      $('#compose-button').attr('aria-expanded', 'false');
    });
  } else {
    $compose.slideDown(() => {
      $('textarea').focus();
      $('#compose-button').attr('aria-expanded', 'true');
      
      // Reset error message and hide it when form opens
      $error.text('').hide();
    });
  }
});

  // Load tweets initially
  loadTweets();
});
