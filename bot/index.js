/**
 * InclusiFit Bot — Powered by Photon Spectrum
 *
 * Runs on iMessage, WhatsApp, Telegram via Spectrum.
 * Users send a photo → get skin analysis + adaptive product recommendations.
 * Users send text commands → get filtered product suggestions.
 *
 * Setup:
 *   1. Get credentials at https://app.photon.codes
 *   2. Set PROJECT_ID and PROJECT_SECRET in .env
 *   3. node --env-file=.env index.js
 */

import { Spectrum } from "spectrum-ts";
import { imessage } from "spectrum-ts/providers/imessage";

const PERFECT_CORP_API_KEY =
  process.env.PERFECT_CORP_API_KEY ||
  "sk-nAlDD07hAMNOq0L2yJTDNPnSDAf6kEASZasf9eXZkm_6VIQVISAxXfOp7f1VUBct";

const BASE = "https://yce-api-01.makeupar.com";

// ── Perfect Corp helpers ──────────────────────────────────────────────────────

async function analyzeSkin(imageUrl) {
  const taskRes = await fetch(`${BASE}/s2s/v2.1/task/skin-analysis`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PERFECT_CORP_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      src_file_url: imageUrl,
      dst_actions: [
        "hd_acne", "hd_pore", "hd_moisture", "hd_redness",
        "hd_texture", "hd_wrinkle", "hd_radiance", "hd_oiliness",
      ],
      miniserver_args: { enable_mask_overlay: false },
    }),
  }).then((r) => r.json());

  const taskId = taskRes?.data?.task_id;
  if (!taskId) return null;

  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await fetch(`${BASE}/s2s/v2.1/task/skin-analysis/${taskId}`, {
      headers: { Authorization: `Bearer ${PERFECT_CORP_API_KEY}` },
    }).then((r) => r.json());
    if (poll?.data?.task_status === "success") return poll.data.results;
  }
  return null;
}

// ── Adaptive product catalog (simplified for bot) ────────────────────────────

const PRODUCTS = [
  { name: "Adaptive Wrap Dress",     category: "clothing",  tags: ["shorter_limbs", "limited_dexterity"], features: "Magnetic snaps, elastic waist, petite length", price: "$89.99" },
  { name: "Easy-On Velcro Tunic",    category: "clothing",  tags: ["limited_dexterity", "loose_fit"],     features: "Velcro closure, loose fit, front opening",  price: "$49.99" },
  { name: "Pull-On Adaptive Trousers",category:"clothing",  tags: ["limited_dexterity", "loose_fit"],     features: "Full elastic waist, pull-on, flat seams",    price: "$69.99" },
  { name: "AFO-Compatible Sneaker",  category: "footwear",  tags: ["afo_user"],                           features: "Extra wide, fits over AFO braces, velcro",   price: "$129.99" },
  { name: "Wide-Fit Slip-On Loafer", category: "footwear",  tags: ["afo_user", "limited_dexterity"],      features: "Wide fit, slip-on, no laces",                price: "$79.99" },
  { name: "Easy-Pump Foundation",    category: "beauty",    tags: ["limited_dexterity"],                  features: "Pump dispenser, one-handed, SPF30",          price: "$42.00" },
  { name: "Natural Wave Wig",        category: "hair",      tags: ["hair_loss"],                          features: "Adjustable band, lightweight, breathable",   price: "$189.00" },
  { name: "Magnetic Clasp Necklace", category: "jewelry",   tags: ["limited_dexterity"],                  features: "Magnetic clasp, one-handed fastening",       price: "$55.00" },
];

const CONCERN_LABELS = {
  hd_acne: "Acne", hd_pore: "Pores", hd_moisture: "Moisture",
  hd_redness: "Redness", hd_texture: "Texture", hd_wrinkle: "Wrinkles",
  hd_radiance: "Radiance", hd_oiliness: "Oiliness",
};

// ── Command parser ────────────────────────────────────────────────────────────

function parseCommand(text) {
  const t = text.toLowerCase().trim();
  if (t.includes("help") || t === "hi" || t === "hello" || t === "start")
    return "help";
  if (t.includes("afo") || t.includes("brace") || t.includes("orthosis"))
    return "afo";
  if (t.includes("loose") || t.includes("easy wear") || t.includes("sma"))
    return "loose";
  if (t.includes("dexterity") || t.includes("velcro") || t.includes("magnetic") || t.includes("dystrophy"))
    return "dexterity";
  if (t.includes("hair") || t.includes("wig") || t.includes("alopecia"))
    return "hair";
  if (t.includes("beauty") || t.includes("skin") || t.includes("makeup"))
    return "beauty";
  if (t.includes("short") || t.includes("petite") || t.includes("achondroplasia"))
    return "shorter_limbs";
  if (t.includes("catalog") || t.includes("shop") || t.includes("products"))
    return "catalog";
  return "unknown";
}

function getProducts(tag) {
  return PRODUCTS.filter((p) => p.tags.includes(tag));
}

function formatProducts(products) {
  if (!products.length) return "No products found for that filter.";
  return products
    .map((p) => `• ${p.name} (${p.price})\n  ${p.features}`)
    .join("\n\n");
}

// ── Message handlers ──────────────────────────────────────────────────────────

const HELP_MSG = `Welcome to InclusiFit — adaptive fashion for everyone.

Commands:
  afo         — AFO-compatible footwear
  loose       — Loose / easy-wear clothing
  dexterity   — Magnetic/velcro closures
  hair        — Wigs and hair loss products
  beauty      — Accessible beauty products
  shorter     — Petite / shorter limb clothing
  catalog     — Full product list

Send a photo of your face for a free AI skin analysis.

Web app: https://inclusift.vercel.app`;

async function handleMessage(space, message) {
  const type = message.content.type;

  // Photo → skin analysis
  if (type === "image" || type === "attachment") {
    await message.reply("Analyzing your skin with Perfect Corp AI... (takes ~15 seconds)");
    try {
      const imageUrl = message.content.url || message.content.src;
      const results = await analyzeSkin(imageUrl);
      if (!results || !results.scores) {
        await message.reply("Could not analyze the image. Please send a clear, well-lit selfie.");
        return;
      }
      const scores = results.scores;
      const sorted = Object.entries(scores)
        .sort(([, a], [, b]) => a - b)
        .slice(0, 4);
      const lines = sorted.map(([k, v]) => `  ${CONCERN_LABELS[k] || k}: ${v}/100`).join("\n");
      await message.reply(
        `Skin Analysis Results:\n\n${lines}\n\nFor personalized product recommendations, visit:\nhttps://inclusift.vercel.app/beauty`
      );
    } catch {
      await message.reply("Something went wrong. Please try again.");
    }
    return;
  }

  // Text commands
  if (type === "text") {
    const cmd = parseCommand(message.content.text);
    switch (cmd) {
      case "help":
        await message.reply(HELP_MSG);
        break;
      case "afo":
        await message.reply(`AFO-Compatible Footwear:\n\n${formatProducts(getProducts("afo_user"))}\n\nTry them on: https://inclusift.vercel.app/shoes`);
        break;
      case "loose":
        await message.reply(`Loose / Easy-Wear Clothing:\n\n${formatProducts(getProducts("loose_fit"))}\n\nVirtual try-on: https://inclusift.vercel.app/catalog?c=loose_fit`);
        break;
      case "dexterity":
        await message.reply(`Adaptive Closures (Magnetic/Velcro):\n\n${formatProducts(getProducts("limited_dexterity"))}\n\nVirtual try-on: https://inclusift.vercel.app/catalog?c=limited_dexterity`);
        break;
      case "hair":
        await message.reply(`Hair Loss / Wigs:\n\n${formatProducts(getProducts("hair_loss"))}\n\nTry styles: https://inclusift.vercel.app/hair`);
        break;
      case "beauty":
        await message.reply(`Accessible Beauty Products:\n\n${formatProducts(getProducts("limited_dexterity").filter(p => p.category === "beauty"))}\n\nSkin analysis: https://inclusift.vercel.app/beauty`);
        break;
      case "shorter_limbs":
        await message.reply(`Petite / Shorter Limb Clothing:\n\n${formatProducts(getProducts("shorter_limbs"))}\n\nVirtual try-on: https://inclusift.vercel.app/catalog?c=shorter_limbs`);
        break;
      case "catalog":
        await message.reply(`Full Adaptive Catalog:\nhttps://inclusift.vercel.app/catalog\n\nCategories: clothing, footwear, beauty, hair, jewelry\n\nType a condition (afo, loose, dexterity, hair, beauty, shorter) for filtered results.`);
        break;
      default:
        await message.reply(`I didn't understand that. Type "help" to see available commands, or send a selfie for a free skin analysis.`);
    }
  }
}

// ── Start bot ─────────────────────────────────────────────────────────────────

const app = await Spectrum({
  projectId: process.env.PROJECT_ID,
  projectSecret: process.env.PROJECT_SECRET,
  providers: [imessage.config()],
});

console.log("InclusiFit bot running on iMessage via Photon Spectrum...");

for await (const [space, message] of app.messages) {
  await space.responding(async () => {
    await handleMessage(space, message);
  });
}
