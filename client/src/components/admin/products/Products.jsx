import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProductsSummary } from "../../../api/admin.js";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [showViewModal, setShowViewModal] = useState(false);
  const [productToView, setProductToView] = useState(null);

  // Mock data for demonstration
  const mockProducts = [
    {
      id: 1,
      name: "Classic Cotton T-Shirt",
      price: "₹1,299",
      stock: 45,
      category: "Men's Topwear",
      status: "Active",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Women's Summer Dress",
      price: "₹2,499",
      stock: 23,
      category: "Women's Dresses",
      status: "Active",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Kids Casual Jeans",
      price: "₹899",
      stock: 67,
      category: "Kids Bottomwear",
      status: "Active",
      image: "https://images.unsplash.com/photo-1582787845328-ec93e8b6e062?w=300&h=300&fit=crop"
    },
    {
      id: 4,
      name: "Premium Leather Jacket",
      price: "₹4,999",
      stock: 12,
      category: "Men's Jackets",
      status: "Active",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop"
    },
    {
      id: 5,
      name: "Formal Shirt",
      price: "₹1,899",
      stock: 34,
      category: "Men's Formal",
      status: "Active",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=300&fit=crop"
    },
    {
      id: 6,
      name: "Casual Sneakers",
      price: "₹3,299",
      stock: 28,
      category: "Footwear",
      status: "Active",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop"
    }
  ];

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (isMounted) {
          setProducts(mockProducts);
        }
      } catch (apiError) {
        if (isMounted) {
          setError(apiError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle product deletion
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    setActionLoading(prev => ({ ...prev, [productToDelete.id]: 'deleting' }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove product from local state
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[productToDelete?.id];
        return newState;
      });
    }
  };

  // Handle product edit
  const handleEditProduct = async (productId) => {
    setActionLoading(prev => ({ ...prev, [productId]: 'editing' }));
    
    try {
      // Simulate navigation to edit page or open edit modal
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Here you would typically navigate to edit page
      // For now, we'll just show an alert
      alert(`Edit functionality for product ID: ${productId} would be implemented here`);
      
    } catch (error) {
      console.error('Error editing product:', error);
      alert('Failed to open edit mode. Please try again.');
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    }
  };

  // Handle product view
  const handleViewProduct = (product) => {
    setProductToView(product);
    setShowViewModal(true);
  };

  // Handle product status toggle
  const toggleProductStatus = async (productId) => {
    setActionLoading(prev => ({ ...prev, [productId]: 'toggling' }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, status: product.status === 'Active' ? 'Inactive' : 'Active' }
          : product
      ));
      
    } catch (error) {
      console.error('Error toggling product status:', error);
      alert('Failed to update product status. Please try again.');
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    }
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Products</h2>
          <p className="text-slate-600 mt-1">
            Manage your product catalog and inventory levels.
          </p>
        </div>
        <Link
          to="/admin/products/upload"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 text-sm font-medium">Total Products</p>
              <p className="text-2xl font-bold text-emerald-800">{loading ? '...' : products.length}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-200 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Active Products</p>
              <p className="text-2xl font-bold text-blue-800">{loading ? '...' : products.filter(p => p.status === 'Active').length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">Low Stock</p>
              <p className="text-2xl font-bold text-amber-800">{loading ? '...' : products.filter(p => p.stock < 20).length}</p>
            </div>
            <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Categories</p>
              <p className="text-2xl font-bold text-purple-800">{loading ? '...' : new Set(products.map(p => p.category)).size}</p>
            </div>
            <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
          Unable to load products.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100/30 border-b border-emerald-100">
            <h3 className="text-lg font-semibold text-emerald-900">Product Catalog</h3>
          </div>
          
          <div className="grid gap-6 p-6 md:grid-cols-2 xl:grid-cols-3">
            {(loading ? Array.from({ length: 6 }) : products).map(
              (product, index) => (
                <div
                  key={product?.id ?? index}
                  className="group bg-gradient-to-br from-white to-emerald-50/30 rounded-xl border border-emerald-100/50 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="w-full h-32 bg-slate-200 rounded-lg mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                      <div className="flex justify-between mb-4">
                        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                      </div>
                      <div className="h-8 bg-slate-200 rounded"></div>
                    </div>
                  ) : (
                    <>
                      <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-slate-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5QzEzLjEwNDYgOSAxNCA5Ljg5NTQzIDE0IDExQzE0IDEyLjEwNDYgMTMuMTA0NiAxMyAxMiAxM0MxMC44OTU0IDEzIDEwIDEyLjEwNDYgMTAgMTFDMTAgOS44OTU0MyAxMC44OTU0IDkgMTIgOVoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTMgNkMzIDQuMzQzMTUgNC4zNDMxNSAzIDYgM0gxOEMxOS42NTY5IDMgMjEgNC4zNDMxNSAyMSA2VjE4QzIxIDE5LjY1NjkgMTkuNjU2OSAyMSAxOCAyMUg2QzQuMzQzMTUgMjEgMyAxOS42NTY5IDMgMThWNlpNNiA1QzUuNDQ3NzIgNSA1IDUuNDQ3NzIgNSA2VjE0LjU4NThMNy4yOTI4OSAxMi4yOTI5QzcuNjgzNDIgMTEuOTAyNCA4LjMxNjU4IDExLjkwMjQgOC43MDcxMSAxMi4yOTI5TDEzIDEzLjU4NThMMTYuMjkyOSA5LjI5Mjg5QzE2LjY4MzQgOC45MDIzNyAxNy4zMTY2IDguOTAyMzcgMTcuNzA3MSA5LjI5Mjg5TDE5IDE0LjU4NThWNkMxOSA1LjQ0NzcyIDE4LjU1MjMgNSAxOCA1SDZaIiBmaWxsPSIjOUNBNEFGIi8+Cjwvc3ZnPgo=';
                          }}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-slate-900 text-lg leading-tight">
                            {product.name}
                          </h3>
                          <p className="text-sm text-emerald-600 font-medium">
                            {product.category}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-xs text-slate-500">Price</p>
                              <p className="font-bold text-emerald-700">{product.price}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Stock</p>
                              <p className={`font-semibold ${
                                product.stock < 20 ? 'text-amber-600' : 'text-slate-700'
                              }`}>
                                {product.stock}
                              </p>
                            </div>
                          </div>
                          
                          <div className={`
                            inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                            ${product.status === 'Active' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-slate-100 text-slate-600'
                            }
                          `}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              product.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}></div>
                            {product.status}
                          </div>
                        </div>
                        
                        <div className="space-y-3 pt-3">
                          {/* Status Toggle */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-600">Status</span>
                            <button
                              onClick={() => toggleProductStatus(product.id)}
                              disabled={actionLoading[product.id]}
                              className={`
                                relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                                ${product.status === 'Active' ? 'bg-emerald-600' : 'bg-slate-300'}
                                ${actionLoading[product.id] ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                              `}
                            >
                              <span
                                className={`
                                  inline-block h-3 w-3 transform rounded-full bg-white transition-transform
                                  ${product.status === 'Active' ? 'translate-x-5' : 'translate-x-1'}
                                `}
                              />
                            </button>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="grid grid-cols-3 gap-2">
                            <button 
                              onClick={() => handleViewProduct(product)}
                              className="px-3 py-2 border border-emerald-200 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-50 transition-all duration-200"
                            >
                              <div className="flex items-center justify-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View
                              </div>
                            </button>
                            
                            <button 
                              onClick={() => handleEditProduct(product.id)}
                              disabled={actionLoading[product.id]}
                              className={`
                                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 
                                ${actionLoading[product.id] === 'editing'
                                  ? 'bg-emerald-400 text-white cursor-not-allowed'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md'
                                }
                              `}
                            >
                              {actionLoading[product.id] === 'editing' ? (
                                <div className="flex items-center justify-center gap-1">
                                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                                  Edit
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                                </div>
                              )}
                            </button>
                            
                            <button 
                              onClick={() => handleDeleteProduct(product)}
                              disabled={actionLoading[product.id]}
                              className={`
                                px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                                ${actionLoading[product.id] === 'deleting'
                                  ? 'bg-red-400 text-white cursor-not-allowed'
                                  : 'border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'
                                }
                              `}
                            >
                              {actionLoading[product.id] === 'deleting' ? (
                                <div className="flex items-center justify-center">
                                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                                </div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 mx-4 max-w-md w-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Delete Product</h3>
                <p className="text-sm text-slate-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-700 mb-2">
                Are you sure you want to delete this product?
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={productToDelete.image}
                  alt={productToDelete.name}
                  className="w-10 h-10 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5QzEzLjEwNDYgOSAxNCA5Ljg5NTQzIDE0IDExQzE0IDEyLjEwNDYgMTMuMTA0NiAxMyAxMiAxM0MxMC44OTU0IDEzIDEwIDEyLjEwNDYgMTAgMTFDMTAgOS44OTU0MyAxMC44OTU0IDkgMTIgOVoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTMgNkMzIDQuMzQzMTUgNC4zNDMxNSAzIDYgM0gxOEMxOS42NTY5IDMgMjEgNC4zNDMxNSAyMSA2VjE4QzIxIDE5LjY1NjkgMTkuNjU2OSAyMSAxOCAyMUg2QzQuMzQzMTUgMjEgMyAxOS42NTY5IDMgMThWNlpNNiA1QzUuNDQ3NzIgNSA1IDUuNDQ3NzIgNSA2VjE0LjU4NThMNy4yOTI4OSAxMi4yOTI5QzcuNjgzNDIgMTEuOTAyNCA4LjMxNjU4IDExLjkwMjQgOC43MDcxMSAxMi4yOTI5TDEzIDEzLjU4NThMMTYuMjkyOSA5LjI5Mjg5QzE2LjY4MzQgOC45MDIzNyAxNy4zMTY2IDguOTAyMzcgMTcuNzA3MSA5LjI5Mjg5TDE5IDE0LjU4NThWNkMxOSA1LjQ0NzcyIDE4LjU1MjMgNSAxOCA1SDZaIiBmaWxsPSIjOUNBNEFGIi8+Cjwvc3ZnPgo=';
                  }}
                />
                <div>
                  <p className="font-medium text-slate-900">{productToDelete.name}</p>
                  <p className="text-sm text-slate-500">{productToDelete.category}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                disabled={actionLoading[productToDelete.id]}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={actionLoading[productToDelete.id]}
                className={`
                  flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${actionLoading[productToDelete.id] 
                    ? 'bg-red-400 text-white cursor-not-allowed' 
                    : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg'
                  }
                `}
              >
                {actionLoading[productToDelete.id] ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Deleting...
                  </div>
                ) : (
                  'Delete Product'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && productToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-semibold text-slate-900">Product Details</h3>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setProductToView(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={productToView.image}
                      alt={productToView.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5QzEzLjEwNDYgOSAxNCA5Ljg5NTQzIDE0IDExQzE0IDEyLjEwNDYgMTMuMTA0NiAxMyAxMiAxM0MxMC44OTU0IDEzIDEwIDEyLjEwNDYgMTAgMTFDMTAgOS44OTU0MyAxMC44OTU0IDkgMTIgOVoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTMgNkMzIDQuMzQzMTUgNC4zNDMxNSAzIDYgM0gxOEMxOS42NTY5IDMgMjEgNC4zNDMxNSAyMSA2VjE4QzIxIDE5LjY1NjkgMTkuNjU2OSAyMSAxOCAyMUg2QzQuMzQzMTUgMjEgMyAxOS42NTY5IDMgMThWNlpNNiA1QzUuNDQ3NzIgNSA1IDUuNDQ3NzIgNSA2VjE0LjU4NThMNy4yOTI4OSAxMi4yOTI5QzcuNjgzNDIgMTEuOTAyNCA4LjMxNjU4IDExLjkwMjQgOC43MDcxMSAxMi4yOTI5TDEzIDEzLjU4NThMMTYuMjkyOSA5LjI5Mjg5QzE2LjY4MzQgOC45MDIzNyAxNy4zMTY2IDguOTAyMzcgMTcuNzA3MSA5LjI5Mjg5TDE5IDE0LjU4NThWNkMxOSA1LjQ0NzcyIDE4LjU1MjMgNSAxOCA1SDZaIiBmaWxsPSIjOUNBNEFGIi8+Cjwvc3ZnPgo=';
                      }}
                    />
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`
                    inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
                    ${productToView.status === 'Active' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-slate-100 text-slate-600'
                    }
                  `}>
                    <div className={`w-2 h-2 rounded-full ${
                      productToView.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}></div>
                    {productToView.status}
                  </div>
                </div>

                {/* Product Information */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">{productToView.name}</h4>
                    <p className="text-emerald-600 font-medium">{productToView.category}</p>
                  </div>

                  {/* Price and Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 rounded-lg p-4">
                      <p className="text-sm text-emerald-600 font-medium mb-1">Price</p>
                      <p className="text-2xl font-bold text-emerald-800">{productToView.price}</p>
                    </div>
                    <div className={`rounded-lg p-4 ${
                      productToView.stock < 20 ? 'bg-amber-50' : 'bg-slate-50'
                    }`}>
                      <p className={`text-sm font-medium mb-1 ${
                        productToView.stock < 20 ? 'text-amber-600' : 'text-slate-600'
                      }`}>Stock</p>
                      <p className={`text-2xl font-bold ${
                        productToView.stock < 20 ? 'text-amber-800' : 'text-slate-800'
                      }`}>{productToView.stock}</p>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-slate-900 mb-2">Product Information</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Category:</span>
                          <span className="font-medium">{productToView.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Status:</span>
                          <span className="font-medium">{productToView.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Product ID:</span>
                          <span className="font-medium">#{productToView.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Placeholder for additional details */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h6 className="font-medium text-slate-900 mb-2">Description</h6>
                      <p className="text-sm text-slate-600">
                        This is a high-quality {productToView.name.toLowerCase()} from our premium collection. 
                        Perfect for everyday wear with excellent comfort and durability.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button 
                      onClick={() => {
                        setShowViewModal(false);
                        setProductToView(null);
                        handleEditProduct(productToView.id);
                      }}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                      Edit Product
                    </button>
                    <button 
                      onClick={() => {
                        setShowViewModal(false);
                        setProductToView(null);
                        handleDeleteProduct(productToView);
                      }}
                      className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Products;
