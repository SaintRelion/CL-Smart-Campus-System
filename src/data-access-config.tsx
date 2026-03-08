import { setAuthLibClientAppName } from "@saintrelion/auth-lib";
import {
  setDataAccessLayerClientAppName,
  setGlobalMode,
} from "@saintrelion/data-access-layer";

export const API_URL = import.meta.env.VITE_API_URL;

setAuthLibClientAppName("smartcampus");
setDataAccessLayerClientAppName("smartcampus");
setGlobalMode("firebase");
