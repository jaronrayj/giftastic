var topics = ["Sushi", "Pizza", "Sandwich", "Soup", "Cake", "Pie", "Fig Newton"];

renderButtons();

function renderButtons() {
    $("#buttons").empty();
    for (let i = 0; i < topics.length; i++) {

        var button = $("<button>").addClass("button");
        var food = topics[i];
        button.attr("value", food).text(food);
        $("#buttons").append(button);
    }
}


// Grab val from input form and push to topics and create the new button
$("#addButton").on("click", function (event) {

    event.preventDefault();

    newQuery = $("#textInput").val().trim();
    $("#textInput").val("");
    topics.push(newQuery);
    renderButtons();

});

var food;
var limit;
var offset;

$(document).on("click", ".button", function () {


    food = $(this).val().trim();

    // List how many gifs to pull
    limit = $("#quantity").val();
    console.log(limit);

    offset = 0;

    // another button that will copy url to clipboard

    renderGifs();

});

function renderGifs() {
    $.ajax({
        type: "GET",
        url: "https://api.giphy.com/v1/gifs/search?api_key=kHPBy6JCURz27DaYABi3JRay2mVFzJ3T&q=" + food + "&limit=" + limit + "&offset=" + offset + "&rating=PG-13&lang=en",
        success: function (response) {
            $("#gifs").empty();
            for (let i = 0; i < response.data.length; i++) {
                const gif = response.data[i].images.fixed_width.url;
                const still = response.data[i].images.fixed_width_still.url;
                const rating = response.data[i].rating.toUpperCase();
                var newP = $("<p>").text("Rating: " + rating);
                newDiv = $("<div>").addClass("col-md-4 images");
                var img = $("<img src=" + gif + ">").val("animate").attr("data-animate", gif).attr("data-still", still);
                newDiv.append(img);
                newDiv.prepend(newP);
                $("#gifs").append(newDiv);

            }
        }
    });
}


$("#generate").on("click", function () {
    offset = parseInt(offset) + parseInt(limit);
    renderGifs();
});

$(document).on("click", "img", function () {
    var val = $(this).val();
    if (val === "still") {
        var animate = $(this).attr("data-animate");
        $(this).attr("src", animate).val("animate");

    }
    if (val === "animate") {
        var still = $(this).attr("data-still");
        $(this).attr("src", still).val("still");
    }
});