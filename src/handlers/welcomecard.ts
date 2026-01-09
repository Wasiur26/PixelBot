import {
  createCanvas,
  loadImage,
  registerFont,
  CanvasRenderingContext2D,
} from "canvas";
import { AttachmentBuilder, GuildMember } from "discord.js";
import path from "path";

const fontsDir = path.join(process.cwd(), "fonts");
registerFont(path.join(fontsDir, "Anton.ttf"), {
  family: "Anton",
});

registerFont(path.join(fontsDir, "buchananlaser.ttf"), {
  family: "BuchananLaser",
});

registerFont(path.join(fontsDir, "Spider-Man.otf"), {
  family: "Extenda",
});

export default async function (member: GuildMember) {
  const username = member.user.username;
  const avatarUrl = member.user.displayAvatarURL({
    extension: "png",
    size: 256,
  });
  const memberCount = member.guild.memberCount;
  const backgroundPath = path.join(process.cwd(), "public/bg.png");
  const imageBuffer = await createWelcomeImage(
    username,
    memberCount,
    avatarUrl,
    backgroundPath
  );
  const attachment = new AttachmentBuilder(imageBuffer, {
    name: "welcome.png",
  });
  const channel = member.guild.channels.cache.get(
    process.env.WELCOME_CHANNEL_ID || ""
  );
  if (channel && channel.isTextBased()) {
    channel.send({ files: [attachment] });
  }
}

function drawBorderedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fillColor: string,
  borderColor: string,
  text: string,
  fontSize: string
) {
  ctx.fillStyle = fillColor;
  ctx.fillRect(x, y, w, h);

  ctx.lineWidth = 3;
  ctx.strokeStyle = borderColor;
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `${fontSize} "Anton"`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + w / 2, y + h / 2);
}

async function createWelcomeImage(
  username: string,
  memberCount: number,
  avatarUrl: string,
  backgroundPath: string
) {
  const width = 800;
  const height = 350;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const background = await loadImage(backgroundPath);
  ctx.drawImage(background, 0, 0, width, height);

  ctx.save();
  ctx.fillStyle = "#FFFFFF";
  ctx.globalAlpha = 0.75;
  ctx.restore();

  const avatarSize = 130;
  const avatarX = width / 2 - avatarSize / 2;
  const avatarY = 30;

  ctx.save();
  ctx.beginPath();
  ctx.arc(
    width / 2,
    avatarY + avatarSize / 2,
    avatarSize / 2,
    0,
    Math.PI * 2,
    true
  );
  ctx.closePath();
  ctx.clip();

  const avatar = await loadImage(avatarUrl);
  ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(
    width / 2,
    avatarY + avatarSize / 2,
    avatarSize / 2,
    0,
    Math.PI * 2,
    true
  );
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#FFFFFF";
  ctx.stroke();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = '80px "Extenda"';
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 5;
  ctx.fillText(username.toUpperCase(), width / 2, 230);
  ctx.shadowBlur = 0;

  ctx.font = '20px "BuchananLaser"';
  ctx.fillText("JUST JOINED THE SERVER", width / 2, 265);

  const boxWidth = 150;
  const boxHeight = 60;
  const padding = 40;

  drawBorderedRect(
    ctx,
    padding,
    height - boxHeight - 20,
    boxWidth,
    boxHeight,
    "#a8181800",
    "#FFFFFF",
    "MEMBER",
    "30px"
  );

  drawBorderedRect(
    ctx,
    width - boxWidth - padding,
    height - boxHeight - 20,
    boxWidth,
    boxHeight,
    "rgba(0,0,0,0.6)",
    "#FFFFFF",
    `#${memberCount}`,
    "30px"
  );

  return canvas.toBuffer();
}
