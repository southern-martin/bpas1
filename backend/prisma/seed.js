import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Sample pools
const staffNames = [
  "Alex Rivera",
  "Jamie Chen",
  "Taylor Brooks",
  "Morgan Patel",
  "Jordan Lee",
  "Casey Nguyen",
  "Riley Carter",
  "Avery Johnson",
  "Sam Torres",
  "Cameron Kim",
  "Quinn Parker",
  "Drew Martinez",
  "Reese Walker",
  "Peyton Scott",
  "Skylar Adams",
  "Harper Davis",
  "Rowan Bennett",
  "Elliot Green",
  "Charlie Morgan",
  "Blake Sullivan"
];

const clientNames = [
  "ABC Holdings",
  "Blue Residence",
  "City Mall",
  "Northwind Energy",
  "Summit Logistics",
  "Evergreen Health",
  "Maple School District",
  "Harbor Hotel",
  "Skyline Tower",
  "Crescent Bank",
  "Lakeside Clinic",
  "Metro Transit",
  "Brighton Apartments",
  "Pioneer Manufacturing",
  "Sunrise Foods",
  "Aurora Media",
  "Greenfield Farms",
  "Riverside Retail",
  "Silverline Tech",
  "Beacon Insurance",
  "Unity Fitness",
  "Grandview Theater",
  "Heritage Museum",
  "Seaside Resort",
  "Oakridge Estates",
  "Copper Labs",
  "Velocity Auto",
  "Highland Grocers",
  "Prairie Construction",
  "Cobalt Robotics"
];

const statuses = ["To Do", "Doing", "Done", "Blocked"];
const planningBuckets = ["Tomorrow", "Next Week", "Later", null];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("Seeding BPAS sample data (resetting existing records)...");

  await prisma.activity.deleteMany({});
  await prisma.card.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.user.deleteMany({});

  // Users
  const ownerPassword = await bcrypt.hash("123456", 10);
  const owner = await prisma.user.create({
    data: {
      name: "Owner",
      role: "Owner",
      email: "owner@example.com",
      password: ownerPassword
    }
  });

  const staffUsers = [];
  for (const name of staffNames) {
    staffUsers.push(
      await prisma.user.create({
        data: { name, role: "Staff", email: null }
      })
    );
  }

  // Clients
  const clients = [];
  for (const name of clientNames) {
    clients.push(await prisma.client.create({ data: { name } }));
  }

  // Projects (1–2 per client)
  const projects = [];
  for (const client of clients) {
    const baseNames = ["Upgrade", "Maintenance", "Renovation", "Audit", "Expansion"];
    const projectCount = Math.random() > 0.5 ? 2 : 1;
    for (let i = 0; i < projectCount; i++) {
      projects.push(
        await prisma.project.create({
          data: {
            name: `${client.name.split(" ")[0]} ${pick(baseNames)}`,
            client_id: client.id
          }
        })
      );
    }
  }

  // Cards (roughly 40 cards distributed)
  const cards = [];
  const cardTitles = [
    "Prepare proposal",
    "Install fixtures",
    "Site walkthrough",
    "Draft scope",
    "Review permits",
    "Order materials",
    "Quality check",
    "Client meeting",
    "Safety inspection",
    "Finalize schedule",
    "Rough-in wiring",
    "System test",
    "Document handoff",
    "Training session",
    "Budget review",
    "Status update",
    "Vendor coordination",
    "Data collection",
    "Design revision",
    "Finalize punchlist"
  ];

  const totalCards = 40;
  for (let i = 0; i < totalCards; i++) {
    const client = pick(clients);
    const relatedProjects = projects.filter(p => p.client_id === client.id);
    const project = relatedProjects.length ? pick(relatedProjects) : null;
    const staff = pick(staffUsers);
    const isEvent = Math.random() > 0.7;
    const title = pick(cardTitles);
    const status = pick(statuses);
    const planning_bucket = pick(planningBuckets);
    const event_time = isEvent ? `2025-12-${String(5 + (i % 10)).padStart(2, "0")} ${9 + (i % 5)}:00` : null;

    const card = await prisma.card.create({
      data: {
        title,
        type: isEvent ? "Event" : "Task",
        status,
        linked_client_id: client.id,
        linked_project_id: project ? project.id : null,
        assigned_to_user_id: staff.id,
        planning_bucket,
        notes_clarified: `${title} for ${client.name}.`
      }
    });
    cards.push(card);
  }

  // Activities: add a couple per card
  const activityNotes = [
    "Initial notes added.",
    "Client confirmed requirements.",
    "Awaiting materials delivery.",
    "On-site work started.",
    "Follow-up scheduled.",
    "Pending approval."
  ];
  const activityPayload = [];
  for (const card of cards) {
    const count = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      activityPayload.push({
        card_id: card.id,
        user_id: pick([...staffUsers, owner]).id,
        status_after: card.status,
        notes_added: pick(activityNotes)
      });
    }
  }
  await prisma.activity.createMany({ data: activityPayload });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error("Seeding failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
