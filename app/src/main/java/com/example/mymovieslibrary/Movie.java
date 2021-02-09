package com.example.mymovieslibrary;

/**
 * The View class. Represents a movie.
 */
public class Movie
{
    private String title;
    private String imageURL;
    private double rating;
    private int releaseYear;


    /**
     * Constructor
     * @param title Movie title.
     * @param imageURL Movie poster image url (to display on the movie page and in the list).
     * @param rating The user's rating for the movie.
     * @param releaseYear Movie release year.
     */
    public Movie(String title, String imageURL, double rating, int releaseYear)
    {
        this.title = title;
        this.imageURL = imageURL;
        this.rating = rating;
        this.releaseYear = releaseYear;
    }

    public Movie() {
    }

    /**
     * Getting the movie title.
     * @return Returns the movie title.
     */
    public String getTitle() {
        return title;
    }

    /**
     * Getting the movie image URL.
     * @return Returns the movie image URL.
     */
    public String getImageURL() {
        return imageURL;
    }

    /**
     * Getting the movie rating.
     * @return Returns the movie rating.
     */
    public double getRating() {
        return rating;
    }

    /**
     * Getting the movie release year.
     * @return Returns the movie release year.
     */
    public int getReleaseYear() {
        return releaseYear;
    }

    /**
     * Setting a new title for the movie.
     * @param title New title for the movie.
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * Setting a new image URL for the movie.
     * @param imageURL New image URL for the movie.
     */
    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    /**
     * Setting a new rating for the movie.
     * @param rating New rating for the movie.
     */
    public void setRating(double rating) {
        this.rating = rating;
    }

    /**
     * Setting a new release year for the movie.
     * @param releaseYear New release year for the movie.
     */
    public void setReleaseYear(int releaseYear) {
        this.releaseYear = releaseYear;
    }
}