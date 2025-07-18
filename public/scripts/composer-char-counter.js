$(document).ready(function () {
  console.log("composer-char-counter.js is loaded!");

  // Event listener
  $(".new-tweet textarea").on("input", function () {
    const maxChars = 140;
    const inputLength = $(this).val().length;
    const charsLeft = maxChars - inputLength;

    // Closest form observer
    const $form = $(this).closest("form");
    const $counter = $form.find(".counter");
    const $errorMessage = $form.find(".error-message");

    // Update text
    $counter.text(charsLeft);

    // Over limit warning
    if (charsLeft < 0) {
      $counter.addClass("over-limit");
      $errorMessage.text("🚫 Tweet exceeds 140 characters!").slideDown();
    } else {
      $counter.removeClass("over-limit");
      $errorMessage.slideUp();
    }
  });
});
