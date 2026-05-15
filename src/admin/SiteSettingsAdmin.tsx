import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function SiteSettingsAdmin() {
  const [activeTab, setActiveTab] = useState<'home_slider' | 'about_slider' | 'founder_info'>('home_slider');

  const [homeSliders, setHomeSliders] = useState<any[]>([]);
  const [aboutSliders, setAboutSliders] = useState<any[]>([]);
  const [founderInfo, setFounderInfo] = useState<any>({ image_url: '', content_text: '' });
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_settings').select('*');
    if (!error && data) {
      setHomeSliders(data.filter(d => d.section_key === 'home_slider'));
      setAboutSliders(data.filter(d => d.section_key === 'about_slider'));
      const fInfo = data.find(d => d.section_key === 'founder_info');
      if (fInfo) {
        setFounderInfo(fInfo);
      } else {
        setFounderInfo({ image_url: '', content_text: '' });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image: ', error);
      alert('Lỗi tải ảnh lên storage');
      return null;
    }
  };

  const handleAddSlider = async (e: React.ChangeEvent<HTMLInputElement>, sectionKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const imageUrl = await uploadImageToStorage(file);
    
    if (imageUrl) {
      const { error } = await supabase.from('site_settings').insert([
        { section_key: sectionKey, image_url: imageUrl }
      ]);
      if (error) {
        alert('Lỗi lưu vào CSDL');
      } else {
        fetchData();
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ảnh này?')) return;
    
    const { error } = await supabase.from('site_settings').delete().eq('id', id);
    if (error) {
      alert('Lỗi khi xóa');
    } else {
      fetchData();
    }
  };

  const handleFounderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const imageUrl = await uploadImageToStorage(file);
    if (imageUrl) {
      setFounderInfo({ ...founderInfo, image_url: imageUrl });
    }
    setUploading(false);
  };

  const handleSaveFounderInfo = async () => {
    setSaving(true);
    if (founderInfo.id) {
      // Update
      const { error } = await supabase.from('site_settings')
        .update({ image_url: founderInfo.image_url, content_text: founderInfo.content_text })
        .eq('id', founderInfo.id);
      if (error) alert('Lỗi khi cập nhật');
      else alert('Cập nhật thành công');
    } else {
      // Insert
      const { error } = await supabase.from('site_settings')
        .insert([{ section_key: 'founder_info', image_url: founderInfo.image_url, content_text: founderInfo.content_text }]);
      if (error) alert('Lỗi khi lưu');
      else {
        alert('Lưu thành công');
        fetchData();
      }
    }
    setSaving(false);
  };

  const renderSliderTab = (sliders: any[], sectionKey: string) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {sectionKey === 'home_slider' ? 'Banner Trang Chủ' : 'Banner Giới Thiệu'}
        </h3>
        <div>
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer transition flex items-center">
            {uploading ? 'Đang tải...' : 'Tải Ảnh Mới'}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => handleAddSlider(e, sectionKey)}
              disabled={uploading}
              ref={sectionKey === activeTab ? fileInputRef : undefined}
            />
          </label>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sliders.length === 0 && !loading && (
          <p className="text-gray-500 col-span-full">Chưa có hình ảnh nào.</p>
        )}
        {sliders.map(item => (
          <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col">
            <div className="h-48 overflow-hidden bg-gray-100">
              <img src={item.image_url} alt="Slider" className="w-full h-full object-cover" />
            </div>
            <div className="p-3 bg-gray-50 flex justify-end">
              <button 
                onClick={() => handleDelete(item.id)}
                className="text-red-600 hover:text-red-800 font-medium text-sm"
              >
                Xóa Ảnh
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('home_slider')}
            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'home_slider'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Banner Trang Chủ
          </button>
          <button
            onClick={() => setActiveTab('about_slider')}
            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'about_slider'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Banner Giới Thiệu
          </button>
          <button
            onClick={() => setActiveTab('founder_info')}
            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'founder_info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Thông Tin Founder
          </button>
        </nav>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-10 text-gray-500 animate-pulse">Đang tải dữ liệu...</div>
        ) : (
          <>
            {activeTab === 'home_slider' && renderSliderTab(homeSliders, 'home_slider')}
            {activeTab === 'about_slider' && renderSliderTab(aboutSliders, 'about_slider')}
            
            {activeTab === 'founder_info' && (
              <div className="space-y-6 max-w-3xl">
                <h3 className="text-lg font-semibold text-gray-800">Thông Tin Founder</h3>
                
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Avatar Founder</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition">
                      {founderInfo.image_url ? (
                        <div className="mb-4">
                          <img src={founderInfo.image_url} alt="Founder Avatar" className="w-32 h-32 mx-auto rounded-full object-cover shadow-sm border" />
                        </div>
                      ) : (
                        <div className="mb-4 h-32 w-32 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          Chưa có ảnh
                        </div>
                      )}
                      
                      <label className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer text-sm">
                        {uploading ? 'Đang tải...' : 'Tải Ảnh Lên'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleFounderImageUpload}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="w-full sm:w-2/3 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nội Dung Giới Thiệu</label>
                      <textarea
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Nhập thông tin giới thiệu về founder..."
                        value={founderInfo.content_text || ''}
                        onChange={(e) => setFounderInfo({ ...founderInfo, content_text: e.target.value })}
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveFounderInfo}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition shadow-sm disabled:opacity-50"
                      >
                        {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
