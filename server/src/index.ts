import express from "express";
import cors from "cors";
import prisma from "./db";

const app = express();
app.use(cors());
app.use(express.json());

app.get("api/posts", async (req, res) => {
    const posts = await prisma.post.findMany({
        include: { author: true },
        orderBy: { createdAt: "desc" },
    });
    res.json(posts);
});

app.listen(3000, () => console.log("listening on http://localhost:3000"));