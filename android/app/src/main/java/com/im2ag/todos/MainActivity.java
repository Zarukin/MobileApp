package com.im2ag.todos;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

import com.baumblatt.capacitor.firebase.auth.CapacitorFirebaseAuth;
import com.im2ag.todos.NativeLinking;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      add(CapacitorFirebaseAuth.class);
      // add(NativeLinking.class);
    }});
  }
}
