import { useState, useEffect } from 'react';
import './OccasionItem.scss';
import Image, { StaticImageData } from 'next/image';
import surveyStore from '@/store/surveyStore';

interface ItemProps {
  id: number;
  name: string;
  description: string;
  url: StaticImageData;
}
export default function OccasionItem({
  id,
  name,
  description,
  url,
}: ItemProps) {
  const [selected, setSelected] = useState(
    surveyStore.getState().occassionId === id,
  );
  useEffect(() => {
    const deselect = surveyStore.subscribe(() => {
      const newSelected = surveyStore.getState().occassionId === id;
      setSelected(newSelected);
    });

    return () => deselect();
  }, [id, name]);
  const setOccasionId = surveyStore((state) => state.setOccationId);

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={() => setOccasionId(id)}
      key={id}
      className={`occation-item ${selected ? 'selected' : ''}`}
    >
      <Image className="" src={url} width={160} alt="noimg" />
      <div>{description}</div>
    </div>
  );
}
