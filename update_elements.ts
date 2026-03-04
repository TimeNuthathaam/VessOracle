import db from './db.js';

const updateElement = db.prepare(`UPDATE cards SET element = @new_element WHERE element = @old_element`);

const elements = [
  { old_element: 'ธาตุดิน', new_element: 'ธาตุดิน: สื่อถึงความมั่นคง หนักแน่น อดทน เน้นเรื่องรูปธรรม เช่น การเงิน การงาน และความสำเร็จที่จับต้องได้' },
  { old_element: 'ธาตุน้ำ', new_element: 'ธาตุน้ำ: สื่อถึงอารมณ์ ความรู้สึก ความอ่อนไหว การปรับตัว และความสัมพันธ์ที่ลึกซึ้ง' },
  { old_element: 'ธาตุลม', new_element: 'ธาตุลม: สื่อถึงความคิด สติปัญญา การสื่อสาร การเปลี่ยนแปลงที่รวดเร็ว และความเป็นอิสระ' },
  { old_element: 'ธาตุไฟ', new_element: 'ธาตุไฟ: สื่อถึงพลังงาน ความกระตือรือร้น แรงบันดาลใจ ความกล้าหาญ และการลงมือทำ' }
];

const updateMany = db.transaction((items) => {
  for (const item of items) {
    updateElement.run(item);
  }
});

updateMany(elements);
console.log('Elements updated successfully.');
