package com.example.mymovieslibrary;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;
import androidx.annotation.Nullable;
import java.util.ArrayList;
import java.util.List;

/**
 * The Model class to manage the database (Extends SQLiteOpenHelper).
 */
public class DatabaseHelper extends SQLiteOpenHelper
{
    public static final String MOVIES_TABLE = "MOVIES_TABLE";
    public static final String TITLE_COLUMN = "TITLE";
    public static final String RELEASED_YEAR_COLUMN = "RELEASED_YEAR";
    public static final String RATING_COLUMN = "RATING";
    public static final String IMAGE_URL_COLUMN = "IMAGE_URL";

    /**
     * Constructor.
     * @param context Context.
     */
    public DatabaseHelper(@Nullable Context context)
    {
        super(context, "movies.db", null, 1);
    }

    /**
     * Called when a new instance has created. The function create a new SQLite table (if not exist already).
     * @param sqLiteDatabase SQLiteDatabase instance.
     */
    @Override
    public void onCreate(SQLiteDatabase sqLiteDatabase)
    {
        Log.i("hybrid", "Inside SQLiteDatabase.onCreate");
        sqLiteDatabase.execSQL("CREATE TABLE IF NOT EXISTS " + MOVIES_TABLE + " (ID INTEGER PRIMARY KEY AUTOINCREMENT, " + TITLE_COLUMN + " TEXT, " + RELEASED_YEAR_COLUMN + " INTEGER, " + RATING_COLUMN + " REAL, " + IMAGE_URL_COLUMN + " TEXT)");
    }


    @Override
    public void onUpgrade(SQLiteDatabase sqLiteDatabase, int i, int i1)
    {
    }


    /**
     * Adds a movie to the device's SQLite database.
     * @param movie A Movie instance to write in the SQLite database.
     */
    public void add_movie(Movie movie)
    {
        SQLiteDatabase sqLiteDatabase = this.getWritableDatabase();
        ContentValues contentValues = new ContentValues();

        contentValues.put(TITLE_COLUMN, movie.getTitle());
        contentValues.put(RELEASED_YEAR_COLUMN, movie.getReleaseYear());
        contentValues.put(RATING_COLUMN, movie.getRating());
        contentValues.put(IMAGE_URL_COLUMN, movie.getImageURL());

        sqLiteDatabase.insert(MOVIES_TABLE, null, contentValues);

        sqLiteDatabase.close();
    }

    /**
     * Getting all the movies from the SQLite database.
     * @return Returns a List of Movie, includes all the movies in the device's database.
     */
    public List<Movie> getMovies()
    {
        List<Movie> moviesList = new ArrayList<>();

        SQLiteDatabase sqLiteDatabase = this.getReadableDatabase();
        Cursor cursor = sqLiteDatabase.rawQuery("SELECT * FROM " + MOVIES_TABLE, null);

        if(cursor.moveToFirst())
        {
            do{
                String title = cursor.getString(1);
                int releasedYear = cursor.getInt(2);
                double rating = cursor.getDouble(3);
                String imageUrl = cursor.getString(4);

                Movie movie = new Movie(title, imageUrl, rating, releasedYear);

                moviesList.add(movie);


            }while (cursor.moveToNext());
        }
        cursor.close();
        sqLiteDatabase.close();
        return moviesList;
    }


    /**
     * Deletes a specific movie from the database.
     * @param title The title of the movie to delete.
     * @param releaseYear The release year of the movie to delete.
     */
    public void removeMovie(String title, int releaseYear)
    {
        SQLiteDatabase sqLiteDatabase = this.getWritableDatabase();

        String query = "DELETE FROM " + MOVIES_TABLE + " WHERE " + TITLE_COLUMN + " = '" + title + "' AND " + RELEASED_YEAR_COLUMN + " = " + releaseYear + "";

        sqLiteDatabase.execSQL(query);
    }
}
