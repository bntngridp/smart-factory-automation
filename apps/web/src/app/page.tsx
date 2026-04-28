import { getProducts } from "@/services/productService";

export default async function Home() {
  const products = await getProducts();

  return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-6">Daftar Produk Industri</h1>

        <div className="grid gap-4">
          {products.map((product: any) => (
              <div key={product.ProductID} className="p-4 border rounded-lg shadow-sm bg-white">
                <h2 className="font-semibold text-lg text-blue-600">{product.ProductName}</h2>
                <p className="text-gray-600">Stok Minimal: {product.MinStock} {product.Unit}</p>
              </div>
          ))}

          {products.length === 0 && (
              <p className="text-gray-500 italic">Belum ada data produk di database.</p>
          )}
        </div>
      </main>
  );
}