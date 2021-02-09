utils = {};

/**
 * Checks if the user try to add movie with missing title or release year, shows a popup if it is, and returns the result.
 * @param title The title of the movie.
 * @param releaseYear The release year of the movie.
 * @returns {boolean} Returns True if the the user tries to add a movie with empty title or release year, otherwise, returns False.
 */
utils.isEmptyTitleOrReleaseYear = function(title, releaseYear)
{
    if (title.replace(/\s+/g, '') === "" || isNaN(releaseYear))
    {
        console.log('I/hybrid: title or releaseYear is empty.');

        let h2 = document.getElementById('dialog_title');
        let p = document.getElementById('dialog_content');

        if (title.replace(/\s+/g, '') === "" && isNaN(releaseYear))
        {
            h2.innerText = "Title and Release Year can't be empty";
            p.innerText = "Please insert Title and Release Year for the movie.";
        }
        else if (title.replace(/\s+/g, '') === "")
        {
            h2.innerText = "Title can't be empty";
            p.innerText = "Please insert a Title for the movie.";
        }
        else
        {
            h2.innerText = "Release Year can't be empty";
            p.innerText = "Please insert a Release Year for the movie.";
        }

        utils.showPopup('popupDialog');

        return true;

    } else
        return false;
}


/**
 * Checking if a movie is already exists in the library, shows a popup if it is and returns the result.
 * @param title title The title of the movie to check.
 * @param releaseYear releaseYear The release year of the movie to check.
 * @returns {boolean} Returns True if the movie is already in the library, otherwise, returns False.
 */
utils.isMovieExists = function (title, releaseYear)
{
    let isExists  = false;

    movies.forEach(function (movie)
    {
        if (isExists)
            return true;

        if (title.localeCompare(movie.title) === 0)
        {
            if (releaseYear === movie.releaseYear)
            {
                document.getElementById('dialog_title').innerText = 'Movie Already Exist !'
                document.getElementById('dialog_content').innerText = 'This movie already exists in your library.'

                utils.showPopup('popupDialog');

                isExists = true;
            }

        }
    });

    return isExists;
}


/**
 * This function adds a movie to the library list and call a java function that adds it to the DataBase.
 * @param title Movie title.
 * @param releaseYear Movie release year.
 * @param imgUrl Movie poster image url (to display on the movie page and in the list).
 * @param rating The user's rating for the movie.
 */
utils.addMovie = function(title, releaseYear, imgUrl, rating)
{
    let ul = document.getElementById('movie_list_ul');

    let li = document.createElement('li');
    li.class = 'ui-listview-item ui-listview-item-static ui-body-inherit ui-first-child';
    li.setAttribute("data-position-to", "window");
    li.setAttribute("data-transition", "pop");

    let index = movies.length;
    li.setAttribute('id', index.toString());

    let a = document.createElement('a');

    let img = document.createElement('img');
    img.src = imgUrl;

    let h2 = document.createElement('h4');
    h2.innerText = title;

    let p = document.createElement('p');
    p.innerText = releaseYear;

    a.setAttribute('href', '#');

    a.appendChild(img);
    a.appendChild(h2);
    a.appendChild(p);

    li.appendChild(a)

    ul.appendChild(li);

    $('#movie_list_ul').listview('refresh');

    console.info('I/hybrid: Log number 1');

    window.viewModel.add_movie(title, releaseYear, imgUrl, rating);

    movies[index] = {
        "imageURL": imgUrl,
        "rating": rating,
        "releaseYear": releaseYear,
        "title": title
    };

    utils.showMoviePage(index);

    document.getElementById("movieTitle").value = "";
    document.getElementById("releaseYear").value = "";
    document.getElementById("imgUrl").value = "";

    $('#addMovie').page();
    let rating_input = $('#rating');
    rating_input.val('0');
    rating_input.slider('refresh');
}


/**
 * Called when the user press on 'submit' button (to add movie to the library), checks if the input is in order and call a function to add the movie.
 * @param title Movie title.
 * @param releaseYear Movie release year.
 * @param imgUrl Movie poster image url (to display in the movie page and in the list).
 * @param rating The user's rating for the movie.
 */
utils.onAddMoviePressed = function(title, releaseYear, imgUrl, rating)
{
    console.log('I/hybrid: Inside onAddMoviePressed(' + title + ', ' + releaseYear + ', ' + imgUrl + ', ' + rating + ')');

    if (utils.isEmptyTitleOrReleaseYear(title, releaseYear))
        return;

    if (utils.isMovieExists(title, releaseYear))
        return;

    utils.addMovie(title, releaseYear, imgUrl, rating);
}


/**
 * Called by the viewModel, when the application starts, to display the movies (from the database) on the library list (that on the screen).
 * @param movies_json_string Json object as a string, that includes all the movies from the device's database.
 */
utils.displayMovies = function(movies_json_string)
{
    movies = []; // A global array that contains all the listed movies.
    let i = 0;

    console.info('I/hybrid: ' + movies_json_string);

    let div = document.getElementById('content_div');
    let ul = document.getElementById('movie_list_ul');

    let parsed_json = JSON.parse(movies_json_string.toString());

    parsed_json.forEach(function (e)
    {
        movies[i] = e;

        let li = document.createElement('li');
        li.setAttribute('class', 'ui-listview-item ui-listview-item-static ui-body-inherit ui-first-child');
        li.setAttribute('id', i.toString());

        let a = document.createElement('a');

        let img = document.createElement('img');
        img.setAttribute('src', e.imageURL);

        let h2 = document.createElement('h2');
        h2.innerText = e.title;

        let p = document.createElement('p');
        p.innerText = e.releaseYear;

        a.setAttribute('href', '#');

        a.appendChild(img);
        a.appendChild(h2);
        a.appendChild(p);

        li.appendChild(a);

        ul.appendChild(li);

        div.appendChild(ul);

        $('#movie_list_ul').listview('refresh');

        i++;
    });
}


/**
 * Called when a movie is pressed (from the ul element). The function navigates to the movie page and displays the movie details.
 * @param index The index of the movie in the movies array.
 */
utils.showMoviePage = function (index)
{
    let movie = movies[index];

    document.location.href = '#movieDetails';

    console.log('I/hybrid: inside showMoviePage(): title = ' + movie.title);
    console.log('I/hybrid: inside showMoviePage(): index = ' + index);

    document.getElementById('h1_titleAndReleaseYear').innerText = movie.title + ' (' + movie.releaseYear + ')';
    document.getElementById('h2_rating').innerText = 'Rating: ' + movie.rating;
    document.getElementById('img').src = movie.imageURL;

    document.getElementById('movieDetailsForm').setAttribute('name', index.toString());
}


/**
 * called when MyProfile tab is pressed. The function navigates to the myProfile page which calculates statistics and show a graph according to the current library.
 */
utils.displayMyProfilePage = function()
{
    document.location.href = '#myProfile';

    console.log('I/hybrid: Inside displayCharts()');

    let movies_length;
    let average = 0;

    if (movies.length > 0)
    {
        movies_length = movies.length;

        console.log('I/hybrid: movies.length = ' + movies.length);
        utils.displayChart();

        for (let i = 0; i < movies_length; i++)
        {
            average += movies[i].rating;
        }
        average = (average / movies_length).toFixed(2);
    }
    else
    {
        movies_length = 0;
    }

    document.getElementById('h1_movies_amount').innerText = movies_length.toString();
    document.getElementById('average_rating').innerText = average;
}


/**
 * Displays the chart in myProfile page
 */
utils.displayChart = function ()
{
    // Creating 2 arrays for tha chart data
    let releaseYears = [];
    let amounts = [];
    let k = 0;
    let doubledIndex = -1;

    releaseYears[0] = movies[0].releaseYear;
    amounts[0] = 1;

    for (let i = 1; i < movies.length; i++)
    {

        for (let j = 0; j < releaseYears.length; j++)
        {
            if(releaseYears[j] === movies[i].releaseYear)
            {
                doubledIndex = j;
            }
        }
        if(doubledIndex >= 0)
        {
            amounts[doubledIndex]++;
            doubledIndex = -1;
        }
        else
        {
            k++;
            amounts[k] = 1;
            releaseYears[k] = movies[i].releaseYear;
        }
    }


    // Making an array of colors for the charts:
    let colors = [
        'rgb(255,99,132)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ]

    // Creating a loop color array, based on the size of the chart amount of labels:
    let loopColors = [];
    for (let i = 0; i < releaseYears.length; i++)
    {
        loopColors[i] = colors[i%colors.length];
    }


    //Drawing the chart:
    let ctx = document.getElementById('releaseYearChart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: releaseYears,
            datasets: [{
                label: 'Your Movies Library by Release Years',
                data: amounts,
                backgroundColor: loopColors,
                borderColor: loopColors,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        stepSize: 1,
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}


/**
 * Called when the edit movie button is pressed. The function inserts the movie details to the page's inputs and navigates to the editMovie page.
 */
utils.DisplayEditMoviePage = function ()
{
    let index = parseInt(document.getElementById('movieDetailsForm').getAttribute('name'));
    let movie = movies[index];

    let title_input = document.getElementById('editMovieTitle');
    let releaseYear_input = document.getElementById('editReleaseYear');
    let imgUrl_input = document.getElementById('editImgUrl');

    title_input.setAttribute('value', movie.title);
    releaseYear_input.setAttribute('value', movie.releaseYear);
    imgUrl_input.setAttribute('value', movie.imageURL);

    $('#editMovie').page();
    let rating_input = $('#editRating');
    rating_input.val(movie.rating);
    rating_input.slider('refresh');

    console.log('I/hybrid: to edit: ' + movie.title + ', ' + movie.releaseYear + ', ' + movie.rating + ', ' + movie.imageURL);

    document.location.href = '#editMovie';
}


/**
 * Edits movie details by deleting and re-adding.
 * @param title The new title.
 * @param releaseYear The new release year.
 * @param imgUrl The new image URL.
 * @param rating The new rating.
 */
utils.editMovie = function (title, releaseYear, imgUrl, rating)
{
    // The name of this element, is the index of the current moivie (to delete).
    let index_to_delete = parseInt(document.getElementById('movieDetailsForm').getAttribute('name'));

    utils.deleteMovie(index_to_delete);
    utils.addMovie(title, releaseYear, imgUrl, rating);

    // Zeroing editPage inputs:
    document.getElementById('editMovieTitle').setAttribute('value', '');
    document.getElementById('editReleaseYear').setAttribute('value', '');
    document.getElementById('editImgUrl').setAttribute('value', '');

    $('#editMovie').page();
    let rating_input = $('#editRating');
    rating_input.val(0);
    rating_input.slider('refresh');
}


/**
 * Called before the user exits the edit page and shows popup dialog to confirms quit intention.
 */
utils.onCancelEdit = function ()
{
    let h2 = document.getElementById('editDialog_title');
    let p = document.getElementById('editDialog_content');
    let h1 = document.getElementById('editWindowTitle');
    let aYesBtn = document.getElementById('editYesBtn');
    let aNoBtn = document.getElementById('editNoBtn');

    h2.innerText = 'Leave Edit Page ?';
    p.innerText = 'Any unsaved data will be lost.';
    h1.innerText = 'Warning';

    aYesBtn.innerText = 'Leave';
    aNoBtn.innerText = 'Stay';

    utils.showPopup('editPopupDialog');
}


/**
 * Shows popup dialog by id.
 * @param popup_id The id of the popup to display.
 */
utils.showPopup = function(popup_id)
{
    $('#'+popup_id).popup('open', {
        transition: "pop",
        positionTo: "window"
    });
}


/**
 * This function deletes a specific movie (by index) from the library, and call a function from the Java viewModel to remove it from the database.
 * @param index The index of the movie (from the movies array) to delete.
 */
utils.deleteMovie = function (index)
{
    let title = movies[index].title;
    let releaseYear = movies[index].releaseYear;

    let i = parseInt(index) + 1;

    let ul = document.getElementById('movie_list_ul');
    ul.removeChild(ul.childNodes[i]);

    $('#movie_list_ul').listview('refresh');

    movies.splice(index, 1);

    for (let j = parseInt(index); j < movies.length; j++)
    {
        document.getElementById((j+1).toString()).setAttribute('id', j.toString());
    }

    window.viewModel.deleteMovie(title, releaseYear);
}
