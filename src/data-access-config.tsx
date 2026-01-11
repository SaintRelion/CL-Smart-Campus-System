import { setAuthLibClientAppName } from "@saintrelion/auth-lib";
import {
  setDataAccessLayerClientAppName,
  setGlobalMode,
} from "@saintrelion/data-access-layer";

export const API_URL = "https://rzgw4vtq-8000.asse.devtunnels.ms/";

setAuthLibClientAppName("smartcampus");
setDataAccessLayerClientAppName("smartcampus");
setGlobalMode("firebase");
