import { userDB, taskDB } from "./database.js";
import bcrypt from "bcrypt";

// Dates relative to today, so the demo data never goes stale
const daysFromNow = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const seedUser = async (username, password) => {
  const existing = await userDB.findOne({ username });
  if (existing) return existing;
  return userDB.insert({ username, password: await bcrypt.hash(password, 10) });
};

const makeTask = (userId, fields) => ({
  userId,
  description: "",
  startDate: null,
  tags: [],
  estimatedHours: 0,
  actualHours: 0,
  notes: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...fields,
});

const runSeed = async () => {
  try {
    const testUser = await seedUser("testuser", "password123");
    const otherUser = await seedUser("otheruser", "password123");

    await taskDB.remove({}, { multi: true });

    await taskDB.insert([
      makeTask(testUser._id, {
        title: "Study React hooks",
        description: "Focus on useState and useEffect",
        module: "Front-End Web Development",
        deadline: daysFromNow(5),
        priority: "high",
        status: "underway",
        tags: ["react", "hooks"],
        estimatedHours: 5,
        actualHours: 2,
        notes: "Need more practice with useEffect",
      }),
      makeTask(testUser._id, {
        title: "Write coursework report",
        description: "Explain architecture and state management",
        module: "Web Development",
        deadline: daysFromNow(14),
        priority: "medium",
        status: "not-started",
        tags: ["report", "architecture"],
        estimatedHours: 8,
      }),
      makeTask(testUser._id, {
        title: "Revise REST APIs",
        description: "Endpoints and HTTP methods",
        module: "Software Engineering",
        deadline: daysFromNow(-3), // deliberately in the past, for demoing overdue styling
        priority: "low",
        status: "completed",
        tags: ["api", "revision"],
        estimatedHours: 3,
        actualHours: 3,
        notes: "Completed practice exercises",
      }),
      // Belongs to another user: used to prove testuser can't see or change it
      makeTask(otherUser._id, {
        title: "Other user's private task",
        description: "testuser must never be able to see this",
        module: "Security Testing",
        deadline: daysFromNow(7),
        priority: "high",
        status: "not-started",
      }),
    ]);

    console.log("Seeding complete. Logins (password: password123): testuser, otheruser");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

runSeed();
