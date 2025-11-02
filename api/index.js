import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "db.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname.replace('/api', '').replace(/^\//, '');
    const searchParams = url.searchParams;
    
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
      return res.status(200).json(data);
    }

    const resource = segments[0];
    const id = segments[1];

    if (!data[resource]) {
      return res.status(404).json({ error: `Resource '${resource}' not found` });
    }

    // If ID specified, return specific item
    if (id) {
      const item = data[resource].find(item => item.id === id || item.id === parseInt(id));
      if (!item) {
        return res.status(404).json({ error: `Item with id '${id}' not found` });
      }
      return res.status(200).json(item);
    }

    // Get all items from resource
    let items = data[resource];

    // Apply query parameter filters
    searchParams.forEach((value, key) => {
      items = items.filter(item => {
        return item[key] && item[key].toString().toLowerCase().includes(value.toLowerCase());
      });
    });

    res.status(200).json(items);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process request" });
  }
}