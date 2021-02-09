package com.example.mymovieslibrary;

import androidx.appcompat.app.AppCompatActivity;
import android.annotation.SuppressLint;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends AppCompatActivity
{
    ViewModel viewModel;
    WebView webView;
    DatabaseHelper databaseHelper;
    boolean finished = false;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Log.i("hybrid", "in onCreate");

        databaseHelper = new DatabaseHelper(MainActivity.this);

        webView = findViewById(R.id.webView);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setAllowUniversalAccessFromFileURLs(true);
        webView.getSettings().setAllowFileAccessFromFileURLs(true);

        viewModel = new ViewModel(webView, databaseHelper);
        webView.addJavascriptInterface(viewModel, "viewModel");

        webView.setWebViewClient(new WebViewClient()
        {
            @Override
            public void onPageFinished(WebView view, String url)
            {
                if (!finished)
                {
                    viewModel = new ViewModel(webView, databaseHelper);
                    viewModel.syncMovies();
                    finished = true;
                }
                super.onPageFinished(view, url);
            }
        });
        webView.loadUrl("file:///android_asset/www/MyLibrary(Home).html");
    }
}