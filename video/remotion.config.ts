import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setCrf(16);
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);

// Ambientes sem download liberado (ex.: CI/containers com Playwright) podem
// apontar pro Chromium já instalado via REMOTION_BROWSER_EXECUTABLE.
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
