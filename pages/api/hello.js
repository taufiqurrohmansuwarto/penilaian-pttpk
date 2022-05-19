import nc from "next-connect";
const handler = nc();

export default handler.get(async (req, res) => {
    try {
        // await sendEmail("taufiqurrohman.suwarto@gmail.com");
        console.log("sukses");
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
    }
});
