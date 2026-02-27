import { setAuthLibClientAppName } from "@saintrelion/auth-lib";
import {
  setDataAccessLayerClientAppName,
  setGlobalMode,
} from "@saintrelion/data-access-layer";

export const API_URL = "https://back.opsularity.space/";

setAuthLibClientAppName("smartcampus");
setDataAccessLayerClientAppName("smartcampus");
setGlobalMode("firebase");
