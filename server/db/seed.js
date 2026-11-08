import { userDB, taskDB } from "./database.js";
import bcrypt from "bcrypt";

// ✅ Create or get existing user
const seedUser = async () => {
  let user = await userDB.findOne({ username: "testuser" });

  if (user) {
    console.log("✅ User already exists:", user._id);
    return user;
  }

  const hashedPassword = await bcrypt.hash("password123", 10);

  user = await userDB.insert({
    username: "testuser",
    password: hashedPassword,
  });

  console.log("✅ Created user:", user._id);
  return user;
};

// ✅ Seed tasks linked to the correct user
const seedTasks = async (userId) => {
  // ✅ clear existing tasks to prevent mismatches
  await taskDB.remove({}, { multi: true });

  console.log("🧹 Cleared old tasks");

  const tasks = [
    {
      userId,
      title: "Study React hooks",
      description: "Focus on useState and useEffect",
      module: "Front-End Web Development",
      deadline: "2026-06-10",
      priority: "high",
      status: "underway",
      tags: ["react", "hooks"],
      estimatedHours: 5,
      actualHours: 2,
      notes: "Need more practice with useEffect",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId,
      title: "Write coursework report",
      description: "Explain architecture and state management",
      module: "Web Development",
      deadline: "2026-06-15",
      priority: "medium",
      status: "not-started",
      tags: ["report", "architecture"],
      estimatedHours: 8,
      actualHours: 0,
      notes: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId,
      title: "Revise REST APIs",
      description: "Endpoints and HTTP methods",
      module: "Software Engineering",
      deadline: "2026-06-08",
      priority: "low",
      status: "completed",
      tags: ["api", "revision"],
      estimatedHours: 3,
      actualHours: 3,
      notes: "Completed practice exercises",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await taskDB.insert(tasks);

  console.log(`✅ Seeded ${tasks.length} tasks for user: ${userId}`);
};

// ✅ Run seed process
const runSeed = async () => {
  try {
    console.log("🌱 Starting seed process...");

    const user = await seedUser();

    await seedTasks(user._id);

    console.log("🎉 Seeding complete");
    console.log("----------------------------------");
    console.log("LOGIN DETAILS:");
    console.log("username: testuser");
    console.log("password: password123");
    console.log("----------------------------------");

    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

runSeed();
