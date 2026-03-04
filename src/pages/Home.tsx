import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Card } from '../types';

const Home = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterElement, setFilterElement] = useState('');

  useEffect(() => {
    fetch('/api/cards')
      .then(res => res.json())
      .then(data => setCards(data));
  }, []);

  const filteredCards = cards.filter(card => {
    const matchSearch = card.name.toLowerCase().includes(search.toLowerCase()) || 
                        card.card_number.toString().includes(search);
    const matchGroup = filterGroup ? card.group_name === filterGroup : true;
    const matchElement = filterElement ? card.element === filterElement : true;
    return matchSearch && matchGroup && matchElement;
  });

  const groups = Array.from(new Set(cards.map(c => c.group_name).filter(Boolean)));
  const elements = Array.from(new Set(cards.map(c => c.element).filter(Boolean)));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-semibold text-earth-900">คลังไพ่ท้าวเวสสุวรรณราชา</h1>
          <p className="text-earth-600 mt-1">ทบทวนความหมายและเทคนิคการจำหน้าไพ่</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อไพ่ หรือหมายเลข..." 
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-earth-200 bg-white focus:outline-none focus:ring-2 focus:ring-earth-400 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 rounded-xl border border-earth-200 bg-white focus:outline-none focus:ring-2 focus:ring-earth-400 text-sm"
            value={filterGroup}
            onChange={e => setFilterGroup(e.target.value)}
          >
            <option value="">ทุกกลุ่ม</option>
            {groups.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select 
            className="px-4 py-2 rounded-xl border border-earth-200 bg-white focus:outline-none focus:ring-2 focus:ring-earth-400 text-sm"
            value={filterElement}
            onChange={e => setFilterElement(e.target.value)}
          >
            <option value="">ทุกธาตุ</option>
            {elements.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link 
              to={`/card/${card.id}`}
              className="block group bg-white rounded-2xl p-4 border border-earth-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="aspect-[2/3] bg-earth-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative border border-earth-100">
                {card.image_url ? (
                  <img src={card.image_url} alt={card.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-earth-300 font-medium text-sm">Placeholder</span>
                )}
                <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-earth-800">
                  {card.card_number.toString().padStart(2, '0')}
                </div>
              </div>
              <h3 className="font-medium text-earth-900 truncate">{card.name}</h3>
              <div className="flex gap-2 mt-2 text-xs text-earth-500">
                {card.element && <span>{card.element}</span>}
              </div>
            </Link>
          </motion.div>
        ))}
        {filteredCards.length === 0 && (
          <div className="col-span-full text-center py-12 text-earth-500">
            ไม่พบข้อมูลไพ่ที่ค้นหา
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Home;
