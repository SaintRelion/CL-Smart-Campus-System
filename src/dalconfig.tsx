import { setAuthLibClientAppName } from "@saintrelion/auth-lib";
import {
  setDataAccessLayerClientAppName,
  setGlobalMode,
} from "@saintrelion/data-access-layer";

setAuthLibClientAppName("smartcampus");
setDataAccessLayerClientAppName("smartcampus");
setGlobalMode("mock");
