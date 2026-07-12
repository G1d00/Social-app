import express from "express";
import cors from "cors";
import prisma from "./db";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/posts", async (req, res) => {
    const limit = Number(req.query.limit) || 20;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const posts = await prisma.post.findMany({
        include: { author: true },
        orderBy: { id: "desc" },
        take: limit,
        where: cursor ? { id: { lt:cursor } } : undefined,
    });
    res.json(posts);
});

app.listen(3000, () => console.log("listening on http://localhost:3000"));