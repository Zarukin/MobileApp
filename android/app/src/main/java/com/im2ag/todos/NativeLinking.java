package com.im2ag.todos;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.login.widget.LoginButton;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FacebookAuthCredential;
import com.google.firebase.auth.FacebookAuthProvider;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.GithubAuthCredential;
import com.google.firebase.auth.GithubAuthProvider;
import com.google.firebase.auth.GoogleAuthProvider;
import com.google.firebase.auth.OAuthProvider;
import com.google.firebase.auth.TwitterAuthProvider;

import static android.content.ContentValues.TAG;

@NativePlugin()
public class NativeLinking extends Plugin {

    private FirebaseAuth mAuth;

    private LoginButton loginButton;
    private CallbackManager mCallbackManager;
    private AccessToken fbAccessToken;
    private AuthCredential fbCredential;

    @PluginMethod()
    public void nativeLinkWith(PluginCall call) {
        if (!call.getData().has("providerId")) {
            call.reject("The provider id is required");
            return;
        }
        String social = call.getString("providerId");
        AuthCredential credential = null;
        if (social.equals("google.com")) {
            String googleIdToken = "";
            credential = GoogleAuthProvider.getCredential(googleIdToken, null);
        } else if (social.equals("facebook.com")) {
            linkWithFacebook();
            this.loginButton.performClick();
            return;
//            credential = fbCredential;
        } else if (social.equals("twitter.com")) {
            linkWithTwitter();
            return;
        } else if (social.equals("github.com")) {
            linkWithGithub();
            return;
        }
        mAuth = FirebaseAuth.getInstance();
        Log.d("CURRENT_USER", "current_user: " + mAuth.getCurrentUser().toString());
//        mAuth.getCurrentUser().linkWithCredential(credential)
//                .addOnCompleteListener(task -> {
//                    if (task.isSuccessful()) {
//                        Log.d(TAG, "linkWithCredential:success");
//                        FirebaseUser user = task.getResult().getUser();
//                    } else {
//                        Log.w(TAG, "linkWithCredential:failure", task.getException());
//                        Toast.makeText(getActivity().getApplicationContext(), "Authentication failed.",
//                                Toast.LENGTH_SHORT).show();
//                    }
//                });

        call.resolve();
    }

    private void linkWithFacebook() {
        final String FACEBOOK_TAG = "FacebookProviderHandler";
        final String PLUGIN_TAG = "NativeLinking";
        try {
            this.loginButton = new LoginButton(this.getContext());
            this.loginButton.setPermissions("email", "public_profile");

            this.mCallbackManager = CallbackManager.Factory.create();

            this.loginButton.registerCallback(mCallbackManager, new FacebookCallback<LoginResult>() {
                @Override
                public void onSuccess(LoginResult loginResult) {
                    Log.d(FACEBOOK_TAG, "facebook:onSuccess:" + loginResult);
                    AccessToken token = loginResult.getAccessToken();
                    AuthCredential credential = FacebookAuthProvider.getCredential(token.getToken());

//                    final PluginCall savedCall = getSavedCall();
//                    if (savedCall == null) {
//                        Log.d(PLUGIN_TAG, "No saved call on activity result.");
//                        return;
//                    }

                    mAuth = FirebaseAuth.getInstance();
                    Log.d("CURRENT_USER", "current_user in facebook: " + mAuth.getCurrentUser().toString());
                    mAuth.getCurrentUser().linkWithCredential(credential)
                            .addOnCompleteListener(task -> {
                                if (task.isSuccessful()) {
                                    Log.d(TAG, "linkWithCredential:success");
                                    FirebaseUser user = task.getResult().getUser();
//                                    savedCall.success();
                                } else {
                                    Log.w(TAG, "linkWithCredential:failure", task.getException());
                                    Toast.makeText(getActivity().getApplicationContext(), "Authentication failed.",
                                            Toast.LENGTH_SHORT).show();
                                }
                            });
                }

                @Override
                public void onCancel() {
                    Log.d(FACEBOOK_TAG, "facebook:onCancel");
                }

                @Override
                public void onError(FacebookException error) {
                    Log.d(FACEBOOK_TAG, "facebook:onError", error);
                }
            });

        } catch (FacebookException error) {
            Log.w(FACEBOOK_TAG, "Facebook initialization error, review your configs", error);
        }
    }

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
//        super.onActivityResult(requestCode, resultCode, data);

        // Pass the activity result back to the Facebook SDK
        mCallbackManager.onActivityResult(requestCode, resultCode, data);
    }

    private void linkWithTwitter() {
        OAuthProvider.Builder provider = OAuthProvider.newBuilder("twitter.com");
        mAuth = FirebaseAuth.getInstance();
        mAuth.getCurrentUser().startActivityForLinkWithProvider(getActivity(), provider.build())
                .addOnSuccessListener(
                        authResult -> {
                            // User is re-authenticated with fresh tokens and
                            // should be able to perform sensitive operations
                            // like account deletion and email or password
                            // update.
                        })
                .addOnFailureListener(
                        e -> {
                            // Handle failure.
                        });
    }

    private void linkWithGithub() {
        OAuthProvider.Builder provider = OAuthProvider.newBuilder("github.com");
        mAuth = FirebaseAuth.getInstance();
        mAuth.getCurrentUser().startActivityForLinkWithProvider(getActivity(), provider.build())
                .addOnSuccessListener(
                        authResult -> {
                            // User is re-authenticated with fresh tokens and
                            // should be able to perform sensitive operations
                            // like account deletion and email or password
                            // update.
                        })
                .addOnFailureListener(
                        e -> {
                            // Handle failure.
                        });
    }
}
