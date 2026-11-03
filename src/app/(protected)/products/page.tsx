import { Suspense } from "react";
import { requireCurrentUser } from "@/features/auth/utils/require-current-user";
import { getCachedProducts } from "@/features/products/product.service";

async function ProductsContent() {
  const user = await requireCurrentUser();
  const products = await getCachedProducts(user.id);

  return (
    <main>
      <h1>Products</h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        products.map((product) => (
          <div key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.price.toString()}</p>
          </div>
        ))
      )}
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading products...</p>}>
      <ProductsContent />
    </Suspense>
  );
}
