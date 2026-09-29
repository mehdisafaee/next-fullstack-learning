import { getCachedProducts } from "@/features/products/product.cache";

export default async function ProductsServerPage() {
  const products = await getCachedProducts();

  return (
    <main>
      <h1>Products — Server Component</h1>

      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.price}</p>
        </div>
      ))}
    </main>
  );
}
