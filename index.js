import express from "express";
import fetch from "node-fetch";
import { createCanvas, loadImage } from "canvas";

const app = express();

app.get("/image", async (req, res) => {
  const imageUrl = req.query.image;
  const username = req.query.username || "Unknown";

  if (!imageUrl) {
    return res.status(400).send("image parametresi gerekli");
  }

  try {
    // Avatarı indir
    const avatarResponse = await fetch(imageUrl);
    const avatarBuffer = await avatarResponse.arrayBuffer();

    const avatar = await loadImage(Buffer.from(avatarBuffer));

    // Canvas boyutu
    const canvas = createCanvas(800, 250);
    const ctx = canvas.getContext("2d");

    // Arka plan
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Avatarı yuvarlak çiz
    ctx.save();
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 25, 200, 200);
    ctx.restore();

    // Kullanıcı adı yaz
    ctx.fillStyle = "#fff";
    ctx.font = "bold 40px Sans";
    ctx.fillText(username, 250, 140);

    // PNG olarak gönder
    res.setHeader("Content-Type", "image/png");
    res.send(canvas.toBuffer("image/png"));
  } catch (error) {
    console.error(error);
    res.status(500).send("Hata oluştu");
  }
});

app.listen(3000, () => console.log("Server çalışıyor"));
