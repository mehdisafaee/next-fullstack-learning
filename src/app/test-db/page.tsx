import prisma from "@/lib/prisma";

export default async function TestDbPage() {
  const products = await prisma.product.findMany();

  return (
    <main>
      <h1>Database Test</h1>

      <pre>{JSON.stringify(products, null, 2)}</pre>
    </main>
  );
}
