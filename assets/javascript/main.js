var topics = ["Sushi", "Pizza", "Sandwich", "Soup", "Cake", "Pie", "Fig Newton"];

for (let i = 0; i < topics.length; i++) {

    var button = $("<button>");
    var food = topics[i];
    button.attr("value", food).text(food);
    $("#buttons").append(button);

}

$(document).on("click", "button", function () {

    var food = $(this).val().trim();

    $.ajax({
        type: "GET",
        url: "https://api.giphy.com/v1/gifs/search?api_key=kHPBy6JCURz27DaYABi3JRay2mVFzJ3T&q=" + food + "&limit=10&offset=0&rating=PG&lang=en",
        success: function (response) {
            console.log(response);
            $("#gifs").empty();
            for (let i = 0; i < response.data.length; i++) {
                const gif = response.data[i].images.fixed_width.url;
                const still = response.data[i].images.fixed_width_still.url;
                const rating = response.data[i].rating.toUpperCase();
                var newP = $("<p>").text("Rating: " + rating);
                newDiv = $("<div>");
                newDiv.val("still").attr("data-animate", gif).attr("data-still", still);
                newDiv.append("<img src=" + still + ">");
                newDiv.prepend(newP);
                $("#gifs").append(newDiv);

            }
        }
    });

});