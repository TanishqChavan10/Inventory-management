import { ProductRow } from './ProductRow';

type Product = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  minCount: number;
};

interface ProductTableProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

export function ProductTable({ products, onEditProduct, onDeleteProduct }: ProductTableProps) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-neutral-700">
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Product Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Category</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Price</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Stock</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Min Stock</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-8">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={onEditProduct}
                  onDelete={onDeleteProduct}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}