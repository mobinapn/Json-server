import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // مسیر فایل db.json
    const filePath = path.join(process.cwd(), "db.json");

    // خواندن و parse کردن JSON
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // پاسخ دادن با تمام داده‌ها
    res.status(200).json(jsonData);
  } catch (err) {
    // خطا در خواندن فایل
    res.status(500).json({ error: "Failed to read db.json" });
  }
}
