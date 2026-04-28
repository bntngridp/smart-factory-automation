import prisma from "@/lib/db";

export async function getProducts() {
    try {
        const products = await prisma.products.findMany();
        return products;
    } catch (error) {
        console.error("Gagal mengambil data produk:", error);
        return [];
    }
}
