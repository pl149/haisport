import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Định nghĩa kiểu dữ liệu theo yêu cầu DB
export interface Product {
  id?: string;
  name: string;
  price: number;
  original_price?: number | null;
  image_url: string;
  images?: string[];
  main_category: string;
  sub_category: string;
  is_best_seller?: boolean;
}

interface ProductFormProps {
  initialData?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const MAIN_CATEGORIES = ['Bóng Đá', 'Cầu Lông', 'Bóng Chuyền', 'Pickleball', 'Khác'];
const SUB_CATEGORIES: Record<string, string[]> = {
  'Bóng Đá': ['Giày', 'Quần áo', 'Trẻ em', 'Quả bóng', 'Phụ kiện', 'Khác'],
  'Cầu Lông': ['Giày', 'Quần áo', 'Vợt', 'Phụ kiện', 'Khác'],
  'Bóng Chuyền': ['Giày', 'Quần áo', 'Quả bóng', 'Phụ kiện', 'Khác'],
  'Pickleball': ['Giày', 'Quần áo', 'Vợt', 'Phụ kiện', 'Khác'],
  'Khác': ['Giày', 'Quần áo', 'Dụng cụ', 'Phụ kiện', 'Khác']
};

export default function ProductForm({ initialData, onClose, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState<any>({
    name: '',
    price: '',
    original_price: '',
    image_url: '',
    main_category: MAIN_CATEGORIES[0],
    sub_category: SUB_CATEGORIES[MAIN_CATEGORIES[0]][0],
    is_best_seller: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCustomDesign, setIsCustomDesign] = useState(false);

  useEffect(() => {
    if (initialData) {
      let initSubCat = initialData.sub_category;
      let isDesign = false;
      if (initialData.main_category === 'Bóng Đá') {
        if (initialData.sub_category === 'CLB' || initialData.sub_category === 'Thiết Kế') {
          initSubCat = 'Quần áo';
          isDesign = initialData.sub_category === 'Thiết Kế';
        }
      }
      setIsCustomDesign(isDesign);

      setFormData({
        ...initialData,
        sub_category: initSubCat,
        price: initialData.price ? initialData.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '',
        original_price: initialData.original_price ? initialData.original_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''
      });
      if (initialData.images && initialData.images.length > 0) {
        setImagePreviews(initialData.images);
      } else if (initialData.image_url) {
        setImagePreviews([initialData.image_url]);
      }
    } else {
      setIsCustomDesign(false);
      setFormData({
        name: '',
        price: '',
        original_price: '',
        image_url: '',
        main_category: MAIN_CATEGORIES[0],
        sub_category: SUB_CATEGORIES[MAIN_CATEGORIES[0]][0],
        is_best_seller: false,
      });
      setImagePreviews([]);
      setImageFiles([]);
    }
  }, [initialData]);

  // Clean up object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    if (name === 'main_category') {
      setFormData((prev: any) => ({
        ...prev,
        main_category: value,
        sub_category: SUB_CATEGORIES[value]?.[0] || ''
      }));
    } else if (name === 'price' || name === 'original_price') {
      const rawValue = value.replace(/\D/g, '');
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      setFormData((prev: any) => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (type === 'checkbox') {
      setFormData((prev: any) => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setImageFiles(fileArray);
      
      const previewUrls = fileArray.map(file => URL.createObjectURL(file));
      setImagePreviews(previewUrls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let finalImageUrl = formData.image_url;
      let finalImages = formData.images || [];

      if (imageFiles && imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

          if (uploadError) {
            throw new Error(`Lỗi tải ảnh: ${uploadError.message}`);
          }

          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          return publicUrl;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        finalImages = uploadedUrls;
        finalImageUrl = uploadedUrls[0];
      }

      const numericPrice = Number(String(formData.price).replace(/\./g, ''));
      const numericOriginalPrice = formData.original_price ? Number(String(formData.original_price).replace(/\./g, '')) : null;

      let finalSubCategory = formData.sub_category;
      if (formData.main_category === 'Bóng Đá' && formData.sub_category === 'Quần áo') {
        finalSubCategory = isCustomDesign ? 'Thiết Kế' : 'CLB';
      }

      if (initialData?.id) {
        // Cập nhật sản phẩm
        const { error: updateError } = await supabase
          .from('products')
          .update({
            name: formData.name,
            price: numericPrice,
            original_price: numericOriginalPrice,
            image_url: finalImageUrl,
            images: finalImages,
            main_category: formData.main_category,
            sub_category: finalSubCategory,
            is_best_seller: formData.is_best_seller,
          })
          .eq('id', initialData.id);

        if (updateError) throw updateError;
      } else {
        // Thêm mới sản phẩm
        const { error: insertError } = await supabase
          .from('products')
          .insert([
            {
              name: formData.name,
              price: numericPrice,
              original_price: numericOriginalPrice,
              image_url: finalImageUrl,
              images: finalImages,
              main_category: formData.main_category,
              sub_category: finalSubCategory,
              is_best_seller: formData.is_best_seller,
            }
          ]);

        if (insertError) throw insertError;
      }

      onSuccess(); // Báo cho danh sách tải lại và đóng modal
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi lưu dữ liệu lên Supabase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800">
            {initialData ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors p-1 rounded-full hover:bg-red-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="mb-5 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="name">
                Tên sản phẩm
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="VD: Giày đá bóng Nike"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-shadow outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="price">
                Giá (VND)
              </label>
              <input
                id="price"
                name="price"
                type="text"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="VD: 500.000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-shadow outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="original_price">
                Giá gốc (VND)
              </label>
              <input
                id="original_price"
                name="original_price"
                type="text"
                value={formData.original_price}
                onChange={handleChange}
                placeholder="VD: 600.000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-shadow outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="image_url">
                Hình ảnh sản phẩm
              </label>
              <input
                id="image_url"
                name="image_url"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-shadow outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imagePreviews && imagePreviews.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Ảnh xem trước:</p>
                  <div className="flex gap-2 flex-wrap">
                    {imagePreviews.map((preview, index) => (
                      <img key={index} src={preview} alt={`Preview ${index}`} className="h-32 w-32 object-cover rounded-md border border-gray-200" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="main_category">
                  Banners (Main Category)
                </label>
                <select
                  id="main_category"
                  name="main_category"
                  value={formData.main_category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-shadow outline-none"
                >
                  {MAIN_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="sub_category">
                  Danh Mục SP (Sub Category)
                </label>
                <select
                  id="sub_category"
                  name="sub_category"
                  value={formData.sub_category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-shadow outline-none"
                >
                  {(SUB_CATEGORIES[formData.main_category] || []).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {formData.main_category === 'Bóng Đá' && formData.sub_category === 'Quần áo' && (
                  <div className="flex items-center mt-2">
                    <input
                      id="is_custom_design"
                      type="checkbox"
                      checked={isCustomDesign}
                      onChange={(e) => setIsCustomDesign(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label className="ml-2 block text-xs font-semibold text-gray-600 cursor-pointer select-none" htmlFor="is_custom_design">
                      Đây là hàng Thiết Kế (Nếu bỏ trống sẽ tự xếp vào mục CLB)
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center mt-2">
              <input
                id="is_best_seller"
                name="is_best_seller"
                type="checkbox"
                checked={!!formData.is_best_seller}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label className="ml-3 block text-sm font-semibold text-gray-700 cursor-pointer" htmlFor="is_best_seller">
                Là sản phẩm bán chạy?
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center min-w-[140px] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang lưu...
                </>
              ) : (initialData ? 'Cập nhật' : 'Thêm Sản Phẩm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
