$(document).ready(function () {
  console.log("composer-char-counter.js is loaded!");

  // Event listener
  $(".new-tweet textarea").on("input", function () {
    const maxChars = 140;
    const inputLength = $(this).val().length;
    const charsLeft = maxChars - inputLength;

    // Find closest
    const counter = $(this).closest("form").find(".counter");

    // Update text
    counter.text(charsLeft);

    // Over limit warning
    if (charsLeft < 0) {
      counter.addClass("over-limit");
    } else {
      counter.removeClass("over-limit");
    }
  });
});
