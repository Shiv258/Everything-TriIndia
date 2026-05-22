import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const property = await prisma.property.upsert({
    where: { slug: "j-residency" },
    update: {
      name: "J Residency",
      address: "Jangpura B, New Delhi",
      city: "New Delhi",
      phone: "+919899402024",
    },
    create: {
      name: "J Residency",
      slug: "j-residency",
      address: "Jangpura B, New Delhi",
      city: "New Delhi",
      phone: "+919899402024",
    },
  });

  const rooms = [
    ["deluxe", "Deluxe Room", 199900, 2, "Compact, clean, and easy for short Delhi stays."],
    ["studio", "Studio Room", 199900, 2, "A practical studio-style room with a calmer residential feel."],
    ["executive-suite", "Executive Attached Suite Room", 249900, 3, "More breathing space with an attached suite layout for longer stays."],
    ["family-suite", "Family Suite Premium Room", 449900, 4, "The larger premium choice for families and group travel."],
  ];

  for (const [slug, name, baseRate, capacity, description] of rooms) {
    await prisma.room.upsert({
      where: { propertyId_slug: { propertyId: property.id, slug } },
      update: { name, baseRate, capacity, description },
      create: { propertyId: property.id, slug, name, baseRate, capacity, description },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
