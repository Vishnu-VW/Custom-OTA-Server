import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

app.post("/api/manifest", async (req, res) => {
  const { appId, platform, runtimeVersion, userId } = req.body;

  if (!userId || !runtimeVersion) {
    return res
      .status(400)
      .json({ error: "userId and runtimeVersion are required" });
  }

  // 1. Check user OTA setting
  const { data: user } = await supabase
    .from("user_ota_settings")
    .select("ota_enabled")
    .eq("user_id", userId)
    .single();

  if (user?.ota_enabled === false) {
    return res.status(204).send(); // OTA disabled
  }

  // 2. Get latest active release
  const { data: release } = await supabase
    .from("releases")
    .select("id, version")
    .eq("runtime_version", runtimeVersion)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!release) {
    return res.status(204).send();
  }

  // 3. Get bundle
  const { data: bundle } = await supabase
    .from("bundles")
    .select("file_path, hash")
    .eq("release_id", release.id)
    .single();

  if (!bundle) {
    return res.status(404).json({ error: "Bundle not found for release" });
  }

  // 4. Signed URL
  const { data: signed, error: signedError } = await supabase.storage
    .from("ota-bundles")
    .createSignedUrl(bundle.file_path, 60 * 60);

  if (signedError || !signed) {
    return res
      .status(500)
      .json({ error: "Failed to create signed URL", details: signedError });
  }

  res.json({
    id: release.id,
    bundleUrl: signed.signedUrl,
    hash: bundle.hash,
  });
});

app.listen(port, () => {
  console.log(`OTA Server running at http://localhost:${port}`);
});
