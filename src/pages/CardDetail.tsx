import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { Card } from '../types';

const CardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState<Card | null>(null);

  useEffect(() => {
    fetch(`/api/cards/${id}`)
      .then(res => res.json())
      .then(data => setCard(data));
  }, [id]);

  const handleDelete = async () => {
    if (confirm('คุณต้องการลบไพ่ใบนี้ใช่หรือไม่?')) {
      await fetch(`/api/cards/${id}`, { method: 'DELETE' });
      navigate('/');
    }
  };

  if (!card) return <div className="p-8 text-center text-earth-500">กำลังโหลด...</div>;

  const renderSection = (title: string, content: string) => {
    if (!content) return null;
    
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-earth-900 mb-3 border-b border-earth-200 pb-2">{title}</h3>
        <ul className="bullet-list text-earth-700 text-sm leading-relaxed space-y-2">
          {paragraphs.map((p, i) => (
            <li key={i}>{p.replace(/^[*-]\s*/, '')}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="flex items-center gap-2 text-earth-500 hover:text-earth-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>กลับ</span>
        </Link>
        <div className="flex gap-2">
          <Link to={`/edit/${card.id}`} className="p-2 text-earth-500 hover:text-earth-800 bg-white rounded-lg border border-earth-200 shadow-sm">
            <Edit className="w-4 h-4" />
          </Link>
          <button onClick={handleDelete} className="p-2 text-red-400 hover:text-red-600 bg-white rounded-lg border border-earth-200 shadow-sm">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-earth-100">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Card Image Placeholder */}
          <div className="w-full md:w-1/3 shrink-0">
            <div className="aspect-[2/3] bg-earth-50 rounded-2xl border-2 border-dashed border-earth-200 flex flex-col items-center justify-center text-earth-400 overflow-hidden relative">
              {card.image_url ? (
                <img src={card.image_url} alt={card.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <>
                  <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                  <span className="text-sm font-medium">พื้นที่แทรกภาพไพ่</span>
                </>
              )}
            </div>
            
            <div className="mt-6 space-y-3">
              {card.group_name && (
                <div className="bg-earth-50 px-4 py-2 rounded-xl text-sm text-earth-700 border border-earth-100">
                  <span className="font-semibold block text-xs text-earth-500 uppercase tracking-wider mb-1">กลุ่มไพ่</span>
                  {card.group_name}
                </div>
              )}
              {card.element && (
                <div className="bg-earth-50 px-4 py-2 rounded-xl text-sm text-earth-700 border border-earth-100">
                  <span className="font-semibold block text-xs text-earth-500 uppercase tracking-wider mb-1">ธาตุ</span>
                  <div className="space-y-1">
                    {card.element.split('\n').filter(p => p.trim()).map((p, i) => (
                      <p key={i} className="leading-relaxed">{p.replace(/^[*-]\s*/, '')}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card Details */}
          <div className="flex-1">
            <div className="mb-8">
              <span className="text-earth-400 font-medium text-lg">ไพ่ใบที่ {card.card_number.toString().padStart(2, '0')}</span>
              <h1 className="text-3xl md:text-4xl font-semibold text-earth-900 mt-1">{card.name}</h1>
            </div>

            <div className="space-y-8">
              {renderSection('ตำนาน / ที่มา', card.legend)}
              {renderSection('คำทำนายทั่วไป', card.general_meaning)}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderSection('การงาน', card.work)}
                {renderSection('การเงิน', card.finance)}
                {renderSection('ความรัก', card.love)}
                {renderSection('สุขภาพ', card.health)}
              </div>
              
              {renderSection('การเสริมดวงชะตา', card.merit)}
              
              <div className="mt-8 pt-8 border-t border-earth-200">
                <h2 className="text-xl font-semibold text-earth-900 mb-6">เทคนิคการจำและตีความเชิงลึก</h2>
                {renderSection('วิธีจำจากหน้าไพ่ (Visual Key)', card.visual_key)}
                {renderSection('รายละเอียดเชิงลึก (Deep Meaning)', card.deep_meaning)}
                {renderSection('ไสยศาสตร์ / สิ่งลี้ลับ (Occult)', card.occult)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CardDetail;
