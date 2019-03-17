// // Default page favs
// todo standard box size
// todo Directions?
// // If query blank, don't process
// // default to 9 images
// todo Decrease offset if<
// // Show favorites when loading if array includes favs
// todo Hotkey to move to search field


$(document).ready(function () {
    var topics = ["Sushi", "Pizza", "Sandwich", "Soup", "Cake", "Pie", "Fig Newton"];
    var favs = [];
    var searches = [];
    var limit;
    var offset = 0;
    var query;





    var favData = JSON.parse(localStorage.getItem("favs"))
    if (favData !== null)
        for (var i = 0; i < favData.length; i++) {
            var element = favData[i];
            favs.unshift(element)

        }

    var searchData = JSON.parse(localStorage.getItem("searches"))
    if (searchData !== null)
        for (var i = 0; i < searchData.length; i++) {
            var element = searchData[i];
            searches.unshift(element)

        }



    // Start up, pull from local storage
    function renderButtons() {
        $("#buttons").empty();
        // topics = localStorage.getItem("choices")
        for (var i = 0; i < topics.length; i++) {

            var button = $("<button>").addClass("button btn btn-info");
            var query = topics[i];
            button.attr("value", query).text(query);
            $("#buttons").append(button);
        }
    }

    function favsStorage() {
        var upload = JSON.stringify(favs)
        console.log("TCL: favsStorage -> upload", upload);
        localStorage.setItem("favs", upload)
    }

    renderButtons();
    renderFavs();


    // Grab val from input form and push to topics and create the new button
    $("#addButton").on("click", function (event) {

        event.preventDefault();

        newQuery = $("#textInput").val().trim();
        if (newQuery !== "") {

            $("#textInput").val("");
            topics.push(newQuery);

            renderButtons();
            query = newQuery;
            renderGifs();
        } else {
            console.log("Put something in the box.....");
        }
        // searches = JSON.stringify(topics)
        // localStorage.setItem("choices", searches);

    });





    // Click the different button options for the value to generate new gifs
    $(document).on("click", ".button", function () {


        query = $(this).val().trim();

        // List how many gifs to pull
        limit = $("#quantity").val();

        offset = 0;

        // another button that will copy url to clipboard

        renderGifs();

    });


    // Populate all of the gifs on the page
    function renderGifs() {

        $.ajax({
            type: "GET",
            url: "https://api.giphy.com/v1/gifs/search?api_key=kHPBy6JCURz27DaYABi3JRay2mVFzJ3T&q=" + query + "&limit=" + limit + "&offset=" + offset + "&rating=PG-13&lang=en",
            success: function (response) {
                $("#gifs").empty();
                for (var i = 0; i < response.data.length; i++) {
                    var gif = response.data[i].images.fixed_width.url;
                    var still = response.data[i].images.fixed_width_still.url;
                    var rating = response.data[i].rating.toUpperCase();
                    var newP = $("<p>").text("Rating: " + rating).addClass("mb-0");
                    newDiv = $("<div>").addClass("col-md-4 images mb-4 card grid-item");
                    var img = $("<img src=" + gif + ">").val("animate").attr("data-animate", gif).attr("data-still", still).addClass("mb-3");
                    if (favs.includes(gif)) {
                        var fav = $("<img src='./assets/images/colorHeart.png'>").addClass("heart mr-4").val("fav");
                    } else {
                        var fav = $("<img src='./assets/images/clearHeart.png'>").addClass("heart mr-4").val("clear");
                    }
                    var copy = $("<img src='./assets/images/copy.png'>").addClass("copy ml-4");
                    copy.val(gif)
                    fav.attr("data-gif", gif);
                    newP.prepend(fav);
                    newP.append(copy);
                    newDiv.append(img);
                    newDiv.prepend(newP);
                    $("#gifs").append(newDiv);

                }
            }
        });
    }


    // todo Set up to retain buttons/ will need a system to remove them also if set up

    // Button ability
    // $(document).on("click", ".heart", function () {
    //     var heartStatus = $(this).val()
    //     if (heartStatus === "clear") {
    //         $(this).attr("src", "./assets/images/colorHeart.png")
    //         $(this).val("fav")
    //         var save = $(this).attr("data-gif");
    //         favs.push(save);

    //     }
    //     if (heartStatus === "fav") {
    //         $(this).attr("src", "./assets/images/clearHeart.png")
    //         $(this).val("clear")
    //         var save = $(this).attr("data-gif");
    //         for (var i = 0; i < favs.length; i++) {
    //             if (favs[i] === save) {
    //                 favs.splice(i, 1);
    //             }
    //         }
    //     }
    //     favsStorage();
    // });


    // Favoriting ability
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
        favsStorage();
    });


    // Generate a new set of gifs
    $("#generate").on("click", function () {
        if (offset === 0) {
            offset = 1;
        }

        limit = $("#quantity").val();
        offset = parseInt(offset) + parseInt(limit);
        renderGifs();
    });


    // Start and stop gif animation
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


    // Go to the favorites screen
    $("#favs").on("click", function () {

        renderFavs();
    });

    function renderFavs() {
        $("#gifs").empty();
        for (var i = 0; i < favs.length; i++) {
            var gif = favs[i];
            var newP = $("<p>").addClass("mb-0");
            newDiv = $("<div>").addClass("col-md-4 images mb-4 card");
            var img = $("<img src=" + gif + ">").addClass("mb-3");
            var fav = $("<img src='./assets/images/colorHeart.png'>").addClass("heart").val("fav");
            fav.attr("data-gif", gif);
            var copy = $("<img src='./assets/images/copy.png'>").addClass("copy");
            copy.val(gif)
            newP.append(copy);
            newP.prepend(fav);
            newDiv.append(img);
            newDiv.prepend(newP);
            $("#gifs").append(newDiv);

        }
    }


    // *Copy the URL to paste it elsewhere
    $(document).on("click", ".copy", function () {

        $('<div>Copied!</div>').insertAfter('#favs').addClass("copied").delay(2000).fadeOut();

        var gif = $(this).val();
        var res = gif.replace("200w.gif", "giphy.gif")
        $("#alert").empty().attr("value", res);
        var copyText = $("#alert");
        copyText.select();


        document.execCommand("copy");

        // *Briefly Show messsage that copy is compvare
    });



});