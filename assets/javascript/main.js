var topics = ["Sushi", "Pizza", "Sandwich", "Soup", "Cake", "Pie", "Fig Newton"];
var favs = [];
renderButtons();

function renderButtons() {
    $("#buttons").empty();
    // topics = localStorage.getItem("choices")
    for (let i = 0; i < topics.length; i++) {

        var button = $("<button>").addClass("button btn btn-info");
        var query = topics[i];
        button.attr("value", query).text(query);
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
    var searches = JSON.stringify(topics)
    localStorage.setItem("choices", searches);

});

var query = "pick something";
var limit;
var offset;

$(document).on("click", ".button", function () {


    query = $(this).val().trim();

    // List how many gifs to pull
    limit = $("#quantity").val();

    offset = 0;

    // another button that will copy url to clipboard

    renderGifs();

});

//Copy to clipboard document.execCommand("copy");

function renderGifs() {
    $.ajax({
        type: "GET",
        url: "https://api.giphy.com/v1/gifs/search?api_key=kHPBy6JCURz27DaYABi3JRay2mVFzJ3T&q=" + query + "&limit=" + limit + "&offset=" + offset + "&rating=PG-13&lang=en",
        success: function (response) {
            $("#gifs").empty();
            for (let i = 0; i < response.data.length; i++) {
                const gif = response.data[i].images.fixed_width.url;
                const still = response.data[i].images.fixed_width_still.url;
                const rating = response.data[i].rating.toUpperCase();
                var newP = $("<p>").text("Rating: " + rating).addClass("mb-0");
                newDiv = $("<div>").addClass("col-md-4 images mb-4");
                var img = $("<img src=" + gif + ">").val("animate").attr("data-animate", gif).attr("data-still", still);
                var fav = $("<img src='./assets/images/clearHeart.png'>").addClass("heart").val("clear");
                var copy = $("<img src='./assets/images/copy.png'>").addClass("copy").val(gif);
                fav.attr("data-gif", gif);
                newP.prepend(fav);
                // var spacer = $("<div>").addClass("col-md-1");
                // newP.append(spacer);
                newP.append(copy);
                newDiv.append(img);
                newDiv.prepend(newP);
                $("#gifs").append(newDiv);

            }
        }
    });
}

$(document).on("click", ".heart", function () {
    var heartStatus = $(this).val()
    if (heartStatus === "clear") {
        $(this).attr("src", "./assets/images/colorHeart.png")
        $(this).val("fav")
        var save = $(this).attr("data-gif");
        favs.push(save);
    }
    if (heartStatus === "fav") {
        $(this).attr("src", "./assets/images/clearHeart.png")
        $(this).val("clear")
        var save = $(this).attr("data-gif");
        for (var i = 0; i < favs.length; i++) {
            if (favs[i] === save) {
                favs.splice(i, 1);
            }
        }
    }
});


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


$("#favs").on("click", function () {
    $("#gifs").empty();
    for (let i = 0; i < favs.length; i++) {
        const gif = favs[i];
        var newP = $("<p>").addClass("mb-0");
        newDiv = $("<div>").addClass("col-md-4 images mb-4");
        var img = $("<img src=" + gif + ">");
        var fav = $("<img src='./assets/images/colorHeart.png'>").addClass("heart").val("fav");
        fav.attr("data-gif", gif);
        newP.prepend(fav);
        newDiv.append(img);
        newDiv.prepend(newP);
        $("#gifs").append(newDiv);

    }
});

$(document).on("click", ".copy", function () {
    var gif = $(this).val();
    console.log(gif);
    gif.select();

    document.execCommand("copy");
});