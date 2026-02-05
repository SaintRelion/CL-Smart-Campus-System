import { firebaseRegister, apiRegister } from "@saintrelion/data-access-layer";

// Firebase
firebaseRegister("User");

// API
apiRegister("User", "user");
