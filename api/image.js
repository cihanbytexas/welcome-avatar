import { createCanvas, loadImage } from "@napi-rs/canvas";

export default async function handler(req, res) {
  try {
    const { image, username = "Unknown" } = req.query;

    if (!image) {
      return res.status(400).send("image parametresi gerekli");
    }

    // Avatarı indir
    const avatar = await loadImage(image);

    // Canvas boyutu
    const canvas = createCanvas(800, 250);
    const ctx = canvas.getContext("2d");

    // Arka plan
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Avatar yuvarlak
    ctx.save();
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 25, 200, 200);
    ctx.restore();

    // Yazı
    ctx.fillStyle = "#fff";
    ctx.font = "bold 40px Sans";
    ctx.fillText(username, 250, 140);

    // PNG döndür
    res.setHeader("Content-Type", "image/png");
    res.send(canvas.toBuffer("image/png"));
  } catch (err) {
    console.error(err);
    res.status(500).send("Hata oluştu");
  }
}
