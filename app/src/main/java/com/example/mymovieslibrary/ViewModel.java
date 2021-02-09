package com.example.mymovieslibrary;

import android.util.Log;
import android.webkit.WebView;
import com.google.gson.Gson;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * The ViewModel class, to contact between the View and the Model instances.
 */
public class ViewModel
{
    private DatabaseHelper model;
    private WebView webView;

    ExecutorService service = Executors.newFixedThreadPool(2);

    /**
     * Constructor.
     * @param webView The View instance.
     * @param model The Model instance.
     */
    public ViewModel(WebView webView, DatabaseHelper model)
    {
        this.webView = webView;
        this.model = model;
    }


    /**
     * Deletes a movie from the database by sending the params to the the Model instance.
     * @param title The title of the movie to delete.
     * @param releaseYear The release year of the movie to delete.
     */
    @android.webkit.JavascriptInterface
    public void deleteMovie(String title, String releaseYear)
    {
        int fixed_releaseYear = Integer.parseInt(releaseYear);
        model.removeMovie(title, fixed_releaseYear);
    }


    /**
     * Asynchronously gets all the movies from the database (by the Model instance), and call a function to display the movies (by the View instance).
     */
    @android.webkit.JavascriptInterface
    public void syncMovies()
    {
        new Thread(new Runnable() {
            @Override
            public void run() {
                Log.i("hybrid", "Inside syncMovies()");

                List<Movie> movies = model.getMovies();

                Gson gson = new Gson();
                final String moviesJsonStr = gson.toJson(movies);

                webView.post(new Runnable() {
                    @Override
                    public void run() {
                        webView.evaluateJavascript("utils.displayMovies('"+moviesJsonStr+"');", null);
                        Log.i("hybrid", "Inside syncMovies(), utils.displayMovies() called");
                    }
                });
            }
        }).start();
    }


    /**
     * Adds a movie to the database (by the Model instance).
     * @param title The title of the movie to add.
     * @param releaseYear The release year of the movie to add.
     * @param imgUrl The image URL of the movie to add.
     * @param rating the rating of the movie to add.
     */
    @android.webkit.JavascriptInterface
    public void add_movie(final String title, final int releaseYear, final String imgUrl, final double rating)
    {
        Log.i("hybrid", "in ViewModel.add_movie(" + title + ", " + releaseYear + ", " + imgUrl + ", " + rating + ")");

        service.submit(new Runnable()
        {
            @Override
            public void run()
            {
                try
                {
                    Movie movie = new Movie(title, imgUrl, rating , releaseYear);
                    model.add_movie(movie);

                }catch (Exception e)
                {
                    webView.evaluateJavascript("utils.displayMessage(" + e.getMessage() + ")", null);
                }
            }
        });
    }
}
