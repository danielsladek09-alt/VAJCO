import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Mažu stará data…");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.product.deleteMany();
  await prisma.pickupLocation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.faqItem.deleteMany();

  console.log("Vytvářím produkty…");
  await prisma.product.createMany({
    data: [
      {
        name: "Čerstvá vejce",
        slug: "cerstva-vejce-6",
        description:
          "Vajíčka od slepic z volného chovu na farmě v Krnici. Ideální balení na vyzkoušení nebo pro menší domácnost.",
        size: "6 ks",
        price: 79,
        available: true,
        stock: 40,
        sortOrder: 1,
      },
      {
        name: "Čerstvá vejce",
        slug: "cerstva-vejce-10",
        description:
          "Naše nejoblíbenější balení. Vejce sbíráme čerstvá a balíme jen pár hodin před vyzvednutím.",
        size: "10 ks",
        price: 129,
        available: true,
        stock: 60,
        sortOrder: 2,
      },
      {
        name: "Čerstvá vejce",
        slug: "cerstva-vejce-20",
        description:
          "Velké balení pro rodiny, restaurace a pekaře. Stálá kvalita, poctivá cena za kus.",
        size: "20 ks",
        price: 239,
        available: true,
        stock: 25,
        sortOrder: 3,
      },
      {
        name: "Vejce XL",
        slug: "vejce-xl-10",
        description:
          "Extra velká vejce od nejzkušenějších nosnic na farmě. Skvělá volba pro pečení.",
        size: "10 ks",
        price: 149,
        available: true,
        stock: 18,
        sortOrder: 4,
      },
      {
        name: "Dárkový košík vajec",
        slug: "darkovy-kosik",
        description:
          "Ručně vázaný košík se 15 vejci a přírodní výplní ze sena — krásný dárek přímo z farmy.",
        size: "15 ks",
        price: 289,
        available: false,
        stock: 0,
        sortOrder: 5,
      },
    ],
  });

  console.log("Vytvářím výdejní místa…");
  const komin = await prisma.pickupLocation.create({
    data: {
      name: "Výdejní místo Komín",
      address: "Fryčajova 1, Brno-Komín",
      city: "Brno",
      lat: 49.2263,
      lng: 16.5646,
      description:
        "Naše hlavní výdejní místo v Brně-Komíně. Vyzvednutí přímo u vrátnice, snadné parkování.",
      active: true,
      sortOrder: 1,
    },
  });

  const kralovoPole = await prisma.pickupLocation.create({
    data: {
      name: "Výdejní místo Královo Pole",
      address: "Cimburkova 4, Brno-Královo Pole",
      city: "Brno",
      lat: 49.2151,
      lng: 16.5892,
      description:
        "Doplňkové výdejní místo v Králově Poli, k dispozici dle nastavených termínů.",
      active: true,
      sortOrder: 2,
    },
  });

  console.log("Vytvářím termíny…");
  const slotTimes = [
    ["08:00", "09:00"],
    ["09:00", "10:00"],
    ["16:00", "17:00"],
    ["17:00", "18:00"],
  ];

  for (const location of [komin, kralovoPole]) {
    for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
      const date = new Date();
      date.setDate(date.getDate() + dayOffset);
      const dow = date.getDay();
      if (dow === 0) continue; // v neděli nevydáváme

      for (const [start, end] of slotTimes) {
        if (dow === 6 && start > "10:00") continue; // v sobotu jen dopoledne
        await prisma.timeSlot.create({
          data: {
            pickupLocationId: location.id,
            date: date.toISOString().slice(0, 10),
            startTime: start,
            endTime: end,
            capacity: location.id === komin.id ? 6 : 4,
          },
        });
      }
    }
  }

  console.log("Vytvářím recenze…");
  await prisma.review.createMany({
    data: [
      {
        authorName: "Petra N.",
        rating: 5,
        text: "Konečně vejce, která chutnají tak, jak si pamatuju od babičky. Žloutky jsou krásně sytě oranžové. Objednávám pravidelně.",
        published: true,
      },
      {
        authorName: "Jakub S.",
        rating: 5,
        text: "Výdej v Komíně je super rychlý a bez čekání. Vejce jsou vždy čerstvá, žádná nikdy nepraskla při přepravě.",
        published: true,
      },
      {
        authorName: "Michaela V.",
        rating: 4,
        text: "Skvělá kvalita i cena. Ocenila bych více termínů na výdej o víkendu, jinak spokojenost.",
        published: true,
      },
      {
        authorName: "Tomáš K.",
        rating: 5,
        text: "Objednávka přes web mi zabrala minutu a vyzvednutí proběhlo přesně podle rezervace. Doporučuji všem, co chtějí poctivé jídlo.",
        published: true,
      },
    ],
  });

  console.log("Vytvářím FAQ…");
  await prisma.faqItem.createMany({
    data: [
      {
        question: "Odkud vejce pocházejí?",
        answer:
          "Všechna vejce pocházejí z naší rodinné farmy v Krnici, kde chováme slepice ve volném výběhu. Vejce nekupujeme od žádných dalších dodavatelů.",
        sortOrder: 1,
      },
      {
        question: "Jak jsou slepice chované?",
        answer:
          "Slepice mají celodenní přístup do venkovního výběhu se zelení, kde se mohou přirozeně pohybovat, hrabat a popelit. V noci a za nepříznivého počasí mají k dispozici prostorný a čistý kurník.",
        sortOrder: 2,
      },
      {
        question: "Čím jsou slepice krmené?",
        answer:
          "Základem krmné dávky jsou obiloviny z blízkého okolí bez zbytečných doplňků. Slepice si navíc samy přiživují na výběhu — trávou, bylinkami a hmyzem.",
        sortOrder: 3,
      },
      {
        question: "Jak čerstvá jsou vejce?",
        answer:
          "Vejce sbíráme každý den ručně a balíme je maximálně několik hodin před vyzvednutím objednávky. Datum sběru najdete přímo na balení.",
        sortOrder: 4,
      },
      {
        question: "Kde si můžu objednávku vyzvednout?",
        answer:
          "Aktuálně nabízíme výdejní místa v Brně-Komíně a Brně-Králově Poli. Přehled i mapu najdete v sekci Výdejní místa.",
        sortOrder: 5,
      },
      {
        question: "Jak si rezervuji termín?",
        answer:
          "Při objednávce vyberete výdejní místo a poté konkrétní datum a čas z nabídky volných termínů. Po odeslání objednávky je termín rezervovaný jen pro vás.",
        sortOrder: 6,
      },
      {
        question: "Jak funguje objednávka?",
        answer:
          "Vyberete si vejce, přidáte je do košíku, zvolíte výdejní místo a termín a vyplníte kontaktní údaje. Objednávku poté vyzvednete a zaplatíte přímo na místě.",
        sortOrder: 7,
      },
    ],
  });

  console.log("Hotovo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
