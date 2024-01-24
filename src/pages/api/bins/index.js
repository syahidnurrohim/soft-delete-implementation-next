import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
  } else {
    const bins = await prisma.bin.findMany();
    return res.json({
      data: bins,
    });
  }
}
