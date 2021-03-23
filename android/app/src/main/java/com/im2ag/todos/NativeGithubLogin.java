package com.im2ag.todos;

import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.OAuthProvider;

@NativePlugin()
public class NativeGithubLogin extends Plugin {

    private FirebaseAuth mAuth;

    @PluginMethod()
    public void nativeLoginWithGithub(PluginCall call) {
        signInWithGithub();
    }

    private void signInWithGithub() {
        OAuthProvider.Builder provider = OAuthProvider.newBuilder("github.com");
        mAuth = FirebaseAuth.getInstance();
        mAuth.startActivityForSignInWithProvider(getActivity(), provider.build())
                .addOnSuccessListener(authResult -> {
                    // User is re-authenticated with fresh tokens and
                    // should be able to perform sensitive operations
                    // like account deletion and email or password
                    // update.
                }).addOnFailureListener(e -> {
                    // Handle failure.
                });
    }
}
