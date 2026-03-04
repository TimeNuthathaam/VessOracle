import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Card } from '../types';

const CardForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState<Partial<Card>>({
    card_number: '' as any,
    name: '',
    group_name: '',
    element: '',
    legend: '',
    general_meaning: '',
    work: '',
    finance: '',
    love: '',
    health: '',
    merit: '',
    visual_key: '',
    deep_meaning: '',
    occult: '',
    image_url: ''
  });

  useEffect(() => {
    if (isEdit) {
      fetch(`/api/cards/${id}`)
        .then(res => res.json())
        .then(data => setFormData(data));
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleListChange = (name: keyof Card, items: string[]) => {
    setFormData(prev => ({ ...prev, [name]: items.join('\n') }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEdit ? `/api/cards/${id}` : '/api/cards';
    const method = isEdit ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    navigate('/');
  };

  const inputClass = "w-full px-4 py-2 rounded-xl border border-earth-200 bg-white focus:outline-none focus:ring-2 focus:ring-earth-400 text-sm text-earth-800";
  const labelClass = "block text-sm font-medium text-earth-700 mb-1";

  const DynamicList = ({ name, label, value }: { name: keyof Card, label: string, value: string }) => {
    const items = (value || '').split('\n').filter(item => item.trim() !== '');
    // Ensure there's at least one empty item to edit if the list is empty
    const displayItems = items.length > 0 ? items : [''];

    const updateItem = (index: number, newValue: string) => {
      const newItems = [...displayItems];
      newItems[index] = newValue;
      handleListChange(name, newItems);
    };

    const addItem = () => {
      handleListChange(name, [...displayItems, '']);
    };

    const removeItem = (index: number) => {
      const newItems = displayItems.filter((_, i) => i !== index);
      handleListChange(name, newItems.length > 0 ? newItems : ['']);
    };

    return (
      <div className="mb-4">
        <label className={labelClass}>{label}</label>
        <div className="space-y-2">
          {displayItems.map((item, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="mt-2 text-earth-400 text-xs">●</span>
              <textarea
                value={item.replace(/^[*-]\s*/, '')}
                onChange={(e) => updateItem(index, e.target.value)}
                className={`${inputClass} flex-1 min-h-[40px] resize-y`}
                rows={1}
                placeholder={`เพิ่มข้อมูล ${label}...`}
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                title="ลบ"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-2 flex items-center gap-1 text-sm text-earth-600 hover:text-earth-800 font-medium"
        >
          <Plus className="w-4 h-4" /> เพิ่มหัวข้อ
        </button>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <Link to={isEdit ? `/card/${id}` : "/"} className="flex items-center gap-2 text-earth-500 hover:text-earth-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>กลับ</span>
        </Link>
        <h1 className="text-2xl font-semibold text-earth-900">
          {isEdit ? 'แก้ไขข้อมูลไพ่' : 'เพิ่มไพ่ใหม่'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-earth-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>หมายเลขไพ่</label>
            <input type="number" name="card_number" value={formData.card_number} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>ชื่อไพ่</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>กลุ่มไพ่</label>
            <input type="text" name="group_name" value={formData.group_name} onChange={handleChange} className={inputClass} placeholder="เช่น กลุ่มเทพเทวา/มหาเทพ" />
          </div>
          <div>
            <label className={labelClass}>ธาตุ</label>
            <textarea name="element" value={formData.element} onChange={handleChange} className={inputClass} rows={2} placeholder="เช่น ธาตุดิน: สื่อถึงความมั่นคง..." />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>URL รูปภาพ (ถ้ามี)</label>
            <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} className={inputClass} placeholder="https://..." />
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-earth-100">
          <h2 className="text-lg font-semibold text-earth-900">ความหมายทั่วไป</h2>
          <DynamicList name="legend" label="ตำนาน / ที่มา" value={formData.legend as string} />
          <DynamicList name="general_meaning" label="คำทำนายทั่วไป" value={formData.general_meaning as string} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DynamicList name="work" label="การงาน" value={formData.work as string} />
            <DynamicList name="finance" label="การเงิน" value={formData.finance as string} />
            <DynamicList name="love" label="ความรัก" value={formData.love as string} />
            <DynamicList name="health" label="สุขภาพ" value={formData.health as string} />
          </div>
          
          <DynamicList name="merit" label="การเสริมดวงชะตา" value={formData.merit as string} />
        </div>

        <div className="space-y-6 pt-6 border-t border-earth-100">
          <h2 className="text-lg font-semibold text-earth-900">เทคนิคการจำและตีความเชิงลึก</h2>
          <DynamicList name="visual_key" label="วิธีจำจากหน้าไพ่ (Visual Key)" value={formData.visual_key as string} />
          <DynamicList name="deep_meaning" label="รายละเอียดเชิงลึก (Deep Meaning)" value={formData.deep_meaning as string} />
          <DynamicList name="occult" label="ไสยศาสตร์ / สิ่งลี้ลับ (Occult)" value={formData.occult as string} />
        </div>

        <div className="pt-6 flex justify-end">
          <button type="submit" className="flex items-center gap-2 bg-earth-800 hover:bg-earth-900 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm">
            <Save className="w-4 h-4" />
            <span>บันทึกข้อมูล</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CardForm;
