import axios from "axios";
import { getServerSession } from "next-auth/next";

export default async (req, res, next) => {
  const data = getServerSession({ req });
  if (data) {
    const { accessToken: token } = data;
    const fetcher = axios.create({
      baseURL: process.env.PROTECTED_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    req.fetcher = fetcher;
    next();
  } else {
    res.status(401).json({ code: 401, message: "Not Authorized" });
  }
};
