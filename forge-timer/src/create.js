/**
 * Reduce an array to milliseconds
 * @param arr
 * @returns {number | any | BigInt | T}
 */
const reduceToMs = (arr) => arr.map((e, idx) => e * [3600000, 60000, 1000, 10][idx]).reduce((a, b) => a + b);
// const totalFromMs = (total) => [3600000, 60000, 1000, 10].map(i => pad(Math.trunc(total / i), 2).substring(0, 2));
const totalFromMs = (total) => {
    var milliseconds = parseInt((total % 1000) / 10),
        seconds = Math.floor((total / 1000) % 60),
        minutes = Math.floor((total / (1000 * 60)) % 60),
        hours = Math.floor((total / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return [hours, minutes, seconds, milliseconds].map(i => pad(i, 2).substring(0, 2));
};

const onFinish = (el, f) => {
    $('#'+el).on("keyup", function() {
        var maxLength = $('#'+el).attr("maxlength");
        if(maxLength == $('#'+el).val().length) {
            f();
        }
    })
};

const next = (from, to) => {
    onFinish(from, () => $('#'+to).focus());
};

$(document).ready(() => {
    $("#direction-select").change((e) => {
        $("#add-lap").attr('disabled', $("#direction-select").val()==="Timer");
        switch ($("#direction-select").val()) {
            case "Stopwatch": {
                $('#create-timer').hide();
                $('#time').show();
                amount = [0, 0, 0, 0];
                total = 0;
                direction = $("#direction-select").val();
                reset();
                break;
            }
            case "Timer": {
                $("#hours-input").val('');
                $("#min-input").val('');
                $("#sec-input").val('');
                $("#ms-input").val('');
                $('#create-timer').show();
                $('#time').hide();
                $("#hours-input").focus();
                next('hours-input', 'min-input');
                next('min-input', 'sec-input');
                next('sec-input', 'ms-input');
                onFinish('ms-input', () => $("#create-timer").submit());
                $("#create-timer").submit(e => {
                    e.preventDefault();
                    direction = $("#direction-select").val();
                    amount = $(".amount").map(function() { // get user time input
                        let v = parseInt(this.value);
                        if (isNaN(v)) {
                            return 0;
                        }
                        return v
                    }).get();
                    $('#create-timer').hide();
                    $('#time').show();
                    // represent amount as milliseconds
                    total = reduceToMs(amount);
                    reset();
                });
                break;
            }
            default: break;
        }
    });

    //Form on 'Timer' page
    // $("#create-form").on('submit', (e) => {
    //     e.preventDefault();
    //     direction = $("#direction-select").val();
    //     amount = $(".amount").map(function() { // get user time input
    //         let v = parseInt(this.value);
    //         if (isNaN(v)) {
    //             return 0;
    //         }
    //         return v
    //     }).get();
    //     if (direction === "Stopwatch") { amount = [0, 0, 0, 0]; }
    //     $("#add-lap").attr('disabled', direction==="Timer");
    //     // represent amount as milliseconds
    //     total = reduceToMs(amount);
    //     reset();
    // });
          
    $("#create-custom-form").on('submit', (e) => {
        e.preventDefault();
        let timerJSON = {
          "name": $("#custom-name").get()[0].value, // Get & store name of timer
          "phases": []
        }; 
        table = $("#rows").get()[0].children; // Get an HTMLCollection of the rows of the table
        for (row of table) { // Get the values for every phase (name, direction, length) and add to timerJSON
          let phaseJSON = {
            "phase-name": row.getElementsByClassName("phase-name")[0].value,
            "direction": row.getElementsByClassName("direction")[0].value,
            "length": row.getElementsByClassName("length")[0].value
          }
          timerJSON["phases"].push(phaseJSON);
        }
        console.log(timerJSON);
        customTimers.push(timerJSON); // Store the new timer in the set
    });

    $("#type-select").change(() => {
              if ($("#type-select").val() === "Football") {
                  $("#user-text").val("# Football\n" +
                      "1. 1st Quarter - down 15:00\n" +
                      "2. 2nd Quarter - down 15:00\n" +
                      "3. 3rd Quarter - down 15:00\n" +
                      "4. 4th Quarter - down 15:00");
              }
          });
      });

$(function () {
  'use strict';

  var $swipeTabsContainer = $('.swipe-tabs'),
      $swipeTabs = $('.swipe-tab'),
      $swipeTabsContentContainer = $('.swipe-tabs-container'),
      currentIndex = 0,
      activeTabClassName = 'active-tab';

  $swipeTabsContainer.on('init', function(event, slick) {
      $swipeTabsContentContainer.removeClass('invisible');
      $swipeTabsContainer.removeClass('invisible');

      currentIndex = slick.getCurrent();
      $swipeTabs.removeClass(activeTabClassName);
      $('.swipe-tab[data-slick-index=' + currentIndex + ']').addClass(activeTabClassName);
  });

  $swipeTabsContainer.slick({
      //slidesToShow: 3.25,
      slidesToShow: 2,
      slidesToScroll: 1,
      arrows: false,
      infinite: false,
      swipeToSlide: true,
      swipe: false,
      touchThreshold: 10
  });

  $swipeTabsContentContainer.slick({
      asNavFor: $swipeTabsContainer,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      infinite: false,
      swipeToSlide: true,
      draggable: false,
      swipe: false,
      touchThreshold: 10
  });


  $swipeTabs.on('click', function(event) {
      // gets index of clicked tab
      currentIndex = $(this).data('slick-index');
      $swipeTabs.removeClass(activeTabClassName);
      $('.swipe-tab[data-slick-index=' + currentIndex +']').addClass(activeTabClassName);
      $swipeTabsContainer.slick('slickGoTo', currentIndex);
      $swipeTabsContentContainer.slick('slickGoTo', currentIndex);
  });

  //initializes slick navigation tabs swipe handler
  $swipeTabsContentContainer.on('swipe', function(event, slick, direction) {
      currentIndex = $(this).slick('slickCurrentSlide');
      $swipeTabs.removeClass(activeTabClassName);
      $('.swipe-tab[data-slick-index=' + currentIndex + ']').addClass(activeTabClassName);
  });
});

