import express from "express";
import cors from "cors";
import prisma from "./db";

const app = express();
const CURRENT_USER_ID = 1;
app.use(cors());
app.use(express.json());

app.get("/api/posts", async (req, res) => {
    const limit = Number(req.query.limit) || 20;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const posts = await prisma.post.findMany({
        include: {
            author: true,
            _count: { select: { likes: true} },
            likes: { where: { userId: CURRENT_USER_ID }, select: {id: true} },
        },
        orderBy: { id: "desc" },
        take: limit,
        where: cursor ? { id: { lt:cursor } } : undefined,
    });

    const shaped = posts.map((p) => ({
        id: p.id,
        content: p.content,
        createdAt: p.createdAt,
        authorId: p.authorId,
        author: p.author,
        likeCount: p._count.likes,
        likedByMe: p.likes.length > 0,
    }));
    res.json(shaped);
});

app.post("/api/posts/:id/like", async (req, res) => {
    const postId = Number(req.params.id);
    await prisma.like.createMany({
        data: [{ userId: CURRENT_USER_ID, postId}],
        skipDuplicates: true,
    })
    res.status(201).json({ok : true});
});

app.delete("/api/posts/:id/like", async (req,res) => {
    const postId = Number(req.params.id);
    await prisma.like.deleteMany({
        where: { userId: CURRENT_USER_ID, postId}
    });
    res.json({ ok: true});
})

app.get("/api/posts/:id/comments", async (req, res) => {
    const postId = Number(req.params.id);
    const comments = await prisma.comment.findMany({
        where: {postId},
        include: {user: true},
        orderBy: {id: "asc"},
    });
    res.json(comments);
})

app.post("/api/posts/:id/comments", async (req, res) => {
    const postId = Number(req.params.id);
    const { content } = req.body;
    if (!content || typeof content !== "string") {
        return res.status(400).json({error: "content is required"});
    }
    const comment = await prisma.comment.create({
        data: { content, postId, userId: CURRENT_USER_ID},
        include: {user: true}
    });
    res.status(201).json(comment);
})

app.listen(3000, () => console.log("listening on http://localhost:3000"));