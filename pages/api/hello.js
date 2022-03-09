import nc from "next-connect";
const handler = nc();

export default handler.get(async (req, res) => {
  res.json({ helo: "world" });
});
