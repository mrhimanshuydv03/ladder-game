const express = require("express");
const { User } = require("./models/user");
const { Attempt } = require("./models/attempt.js");
const app = express();
const cors = require("cors");
const db = require("./config/db.js");

db();

app.use(cors());
app.use(express.json());

app.post("/login", async (req, res) => {
    console.log("here");
    const u = req.body;

    const userExist = await User.findOne({ email: u.email });

    if (!userExist) {
        return res.status(401).json({ msg: "user don't exist" });
    }

    if (userExist && userExist.password == u.password) {
        return res.status(200).json({
            authentication: true,
            id: userExist.id,
            email: userExist.email,
        });
    } else {
        return res.status(401).json({
            authentication: false,
            msg: "authentication failed",
        });
    }
});
app.post("/register", async (req, res) => {
    const u = req.body;

    const userExist = await User.findOne({ email: u.email });

    if (userExist) {
        return res.status(400).json({
            msg: `User already exist with ${u.email}`,
        });
    }

    const user = await User.create(u);

    if (user) {
        return res.status(201).json({ id: user.id, email: user.email });
    } else {
        return res.status(400).json({ msg: "user registeration failed" });
    }
});

function CalculateScore(profit, loss, time) {
    const score = (profit * 100) / (loss * time);
    return score;
}

app.post("/attempt", async (req, res) => {
    const { email, profit, loss, time } = req.body;

    const user = await User.findOne({ email: email });

    const attempt = await Attempt.create({
        user: user._id,
        profit,
        loss,
        time,
        score: CalculateScore(profit.length, loss.length, time),
    });

    if (attempt) {
        const leaderboard = await Attempt.find()
            .populate({ path: "user", select: "name email" })
            .sort({ score: -1 })
            .limit(2);
        const dashboard = {
            current_attempt: attempt,
            current_user: { name: user.name, email: user.email },
            leaderboard,
        };

        return res
            .status(200)
            .json({ dashboard, msg: "Attempt recorded successfully" });
    } else {
        return res.status(400).json({ msg: "Attempt recorded Unsuccessfully" });
    }
});

app.listen("3000", () => {
    console.log("Server is running on port 3000");
});
