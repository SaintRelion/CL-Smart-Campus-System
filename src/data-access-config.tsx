import { setAuthLibClientAppName } from "@saintrelion/auth-lib";
import {
  setDataAccessLayerClientAppName,
  setGlobalMode,
} from "@saintrelion/data-access-layer";

export const API_URL = "http://127.0.0.1:8000/";

setAuthLibClientAppName("smartcampus");
setDataAccessLayerClientAppName("smartcampus");
setGlobalMode("firebase");
