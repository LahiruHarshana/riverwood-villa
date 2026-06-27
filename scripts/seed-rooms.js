#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

let MongoClient;

try {
  ({ MongoClient } = require("mongodb"));
} catch {
  throw new Error("Missing dependency: mongodb. Run `npm install` before seeding rooms.");
}

const rootDir = path.resolve(__dirname, "..");
const dryRun = process.argv.includes("--dry-run");

function loadEnvFile(fileName) {
  const filePath = path.join(rootDir, fileName);

  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function getDatabaseName(uri) {
  if (process.env.MONGODB_DB_NAME) return process.env.MONGODB_DB_NAME;

  try {
    const parsed = new URL(uri);
    const dbName = parsed.pathname.replace(/^\//, "");

    if (dbName) return dbName;
  } catch {
    // Let MongoClient surface invalid connection strings with its own error.
  }

  return "riverwood-villa";
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGODB_URI is required. Set it to your MongoDB Atlas connection string.");
}

const dbName = getDatabaseName(uri);
const collectionName = process.env.MONGODB_ROOMS_COLLECTION || "rooms";
const currency = process.env.NEXT_PUBLIC_BOOKING_CURRENCY || "USD";

const rooms = [
  {
    name: "Riverside Canopy Room",
    slug: "riverside-canopy-room",
    description:
      "A calm private room with a canopy bed, warm timber details, and easy access to the riverside balcony.",
    shortDescription: "Canopy bed room beside the riverside balcony.",
    pricePerNight: 95,
    currency,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Queen bed", "Air conditioning", "Private bathroom", "Wi-Fi", "Balcony access"],
    images: [
      "/villa/villa-bedroom-canopy.jpg",
      "/villa/villa-balcony-chairs-river.webp",
      "/villa/villa-long-balcony.jpg",
    ],
    isAvailable: true,
    status: "active",
    sortOrder: 1,
  },
  {
    name: "High Ceiling Garden Room",
    slug: "high-ceiling-garden-room",
    description:
      "A bright room with a high ceiling, soft natural light, and a relaxed view toward the villa garden spaces.",
    shortDescription: "Bright high-ceiling room with garden-facing calm.",
    pricePerNight: 90,
    currency,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Queen bed", "Air conditioning", "Private bathroom", "Wi-Fi", "Garden view"],
    images: [
      "/villa/villa-bedroom-high-ceiling.jpg",
      "/villa/villa-balcony-palms.webp",
      "/villa/villa-hallway.webp",
    ],
    isAvailable: true,
    status: "active",
    sortOrder: 2,
  },
  {
    name: "Work Desk Villa Room",
    slug: "work-desk-villa-room",
    description:
      "A simple private room with desk space, soft lighting, and quick access to the shared dining terrace.",
    shortDescription: "Private room with desk space and terrace access.",
    pricePerNight: 85,
    currency,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Queen bed", "Work desk", "Air conditioning", "Private bathroom", "Wi-Fi"],
    images: [
      "/villa/villa-bedroom-desk.jpg",
      "/villa/villa-terrace-dining.webp",
      "/villa/villa-balcony-table.jpg",
    ],
    isAvailable: true,
    status: "active",
    sortOrder: 3,
  },
  {
    name: "Forest View Suite",
    slug: "forest-view-suite",
    description:
      "A spacious suite featuring floor-to-ceiling windows overlooking the lush forest, perfect for nature lovers.",
    shortDescription: "Spacious suite with panoramic forest views.",
    pricePerNight: 120,
    currency,
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["King bed", "Sofa bed", "Air conditioning", "Private bathroom", "Wi-Fi", "Forest view", "Mini fridge"],
    images: [
      "/villa/villa-bedroom-desk.jpg",
      "/villa/villa-balcony-palms.webp",
    ],
    isAvailable: true,
    status: "active",
    sortOrder: 4,
  },
  {
    name: "The Grand Master Suite",
    slug: "grand-master-suite",
    description:
      "The crown jewel of Riverwood Villa. Features a private jacuzzi, premium linens, and an expansive private terrace.",
    shortDescription: "Luxury suite with private jacuzzi and large terrace.",
    pricePerNight: 250,
    currency,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["King bed", "Jacuzzi", "Air conditioning", "Private bathroom", "Wi-Fi", "Private terrace", "Room service"],
    images: [
      "/villa/villa-bedroom-canopy.jpg",
      "/villa/villa-terrace-dining.webp",
    ],
    isAvailable: true,
    status: "active",
    sortOrder: 5,
  },
  {
    name: "Cozy Nook Room",
    slug: "cozy-nook-room",
    description:
      "An intimate, warmly lit room ideal for solo travelers or short stays, offering peaceful garden views.",
    shortDescription: "Intimate and cozy room for solo travelers.",
    pricePerNight: 70,
    currency,
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Single bed", "Air conditioning", "Shared bathroom access", "Wi-Fi"],
    images: [
      "/villa/villa-bedroom-high-ceiling.jpg",
      "/villa/villa-hallway.webp",
    ],
    isAvailable: true,
    status: "active",
    sortOrder: 6,
  },
  {
    name: "Family Heritage Room",
    slug: "family-heritage-room",
    description:
      "A large family room with traditional wooden furnishings, offering ample space for parents and children.",
    shortDescription: "Spacious room designed for family stays.",
    pricePerNight: 150,
    currency,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["Queen bed", "Two single beds", "Air conditioning", "Private bathroom", "Wi-Fi", "TV"],
    images: [
      "/villa/villa-bedroom-canopy.jpg",
      "/villa/villa-bedroom-desk.jpg",
    ],
    isAvailable: true,
    status: "active",
    sortOrder: 7,
  },
  {
    name: "River Breeze Room",
    slug: "river-breeze-room",
    description:
      "Experience the cool breeze right from the river. This room features large openable shutters and serene sounds of water.",
    shortDescription: "Refreshing room right by the river.",
    pricePerNight: 105,
    currency,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Queen bed", "Ceiling fan", "Private bathroom", "Wi-Fi", "River view"],
    images: [
      "/villa/villa-long-balcony.jpg",
      "/villa/villa-balcony-chairs-river.webp",
    ],
    isAvailable: true,
    status: "active",
    sortOrder: 8,
  },
  {
    name: "Sunrise Balcony Room",
    slug: "sunrise-balcony-room",
    description:
      "Wake up to breathtaking sunrises. A beautifully appointed room facing east for the perfect morning glow.",
    shortDescription: "East-facing room for beautiful sunrises.",
    pricePerNight: 110,
    currency,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Queen bed", "Air conditioning", "Private bathroom", "Wi-Fi", "East balcony"],
    images: [
      "/villa/villa-balcony-table.jpg",
      "/villa/villa-bedroom-high-ceiling.jpg",
    ],
    isAvailable: true,
    status: "active",
    sortOrder: 9,
  },
  {
    name: "Sunset Retreat",
    slug: "sunset-retreat",
    description:
      "Enjoy the golden hour from your private seating area. A cozy room with warm tones and relaxed vibes.",
    shortDescription: "Cozy room perfect for evening relaxation.",
    pricePerNight: 110,
    currency,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Queen bed", "Air conditioning", "Private bathroom", "Wi-Fi", "West balcony"],
    images: [
      "/villa/villa-bedroom-canopy.jpg",
      "/villa/villa-terrace-dining.webp",
    ],
    isAvailable: true,
    status: "active",
    sortOrder: 10,
  },
  {
    name: "The Writer's Studio",
    slug: "writers-studio",
    description:
      "A secluded room at the corner of the villa featuring an antique writing desk and absolute tranquility.",
    shortDescription: "Secluded, quiet room with an antique desk.",
    pricePerNight: 95,
    currency,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Queen bed", "Antique desk", "Air conditioning", "Private bathroom", "Wi-Fi"],
    images: [
      "/villa/villa-bedroom-desk.jpg",
      "/villa/villa-hallway.webp",
    ],
    isAvailable: true,
    status: "active",
    sortOrder: 11,
  },
  {
    name: "Twin Garden Room",
    slug: "twin-garden-room",
    description:
      "A vibrant room featuring twin beds with direct access to the villa's lush tropical garden.",
    shortDescription: "Twin beds with direct garden access.",
    pricePerNight: 85,
    currency,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Two single beds", "Air conditioning", "Private bathroom", "Wi-Fi", "Garden access"],
    images: [
      "/villa/villa-balcony-palms.webp",
      "/villa/villa-bedroom-high-ceiling.jpg",
    ],
    isAvailable: true,
    status: "active",
    sortOrder: 12,
  },
];

async function seedRooms() {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const collection = client.db(dbName).collection(collectionName);

    if (!dryRun) {
      await collection.createIndex({ slug: 1 }, { unique: true });
    }

    console.log(
      `${dryRun ? "Checking" : "Seeding"} ${rooms.length} rooms into ${dbName}.${collectionName}...`
    );

    for (const room of rooms) {
      const now = new Date();

      if (dryRun) {
        console.log(`Would upsert ${room.slug}`);
        continue;
      }

      const result = await collection.updateOne(
        { slug: room.slug },
        {
          $set: {
            ...room,
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt: now,
          },
        },
        { upsert: true }
      );

      const action = result.upsertedCount > 0 ? "Inserted" : "Updated";
      console.log(`${action} ${room.slug}`);
    }
  } finally {
    await client.close();
  }
}

seedRooms()
  .then(() => {
    console.log(dryRun ? "Dry run complete." : "Room seed complete.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Room seed failed:", error);
    process.exit(1);
  });
