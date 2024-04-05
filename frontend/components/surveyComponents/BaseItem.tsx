import { useState, useEffect } from 'react';
import './BaseItem.scss';
import Image, { StaticImageData } from 'next/image';
import surveyStore from '@/store/surveyStore';

interface ItemProps {
  id: number;
  name: string;
  imgsrc: StaticImageData;
}
export default function BaseItem({ id, name, imgsrc }: ItemProps) {
  const [selected, setSelected] = useState(
    surveyStore.getState().baseId === id,
  );
  useEffect(() => {
    const deselect = surveyStore.subscribe(() => {
      const newSelected = surveyStore.getState().baseId === id;
      setSelected(newSelected);
    });

    return () => deselect();
  }, [id, name]);
  const setBaseId = surveyStore((state) => state.setBaseId);
  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={() => setBaseId(id)}
      key={id}
      className={`base-item ${selected ? 'selected' : ''}`}
    >
      <Image src={imgsrc} width={100} alt="nobase" />
      <div className="name">{name}</div>
    </div>
  );
}
