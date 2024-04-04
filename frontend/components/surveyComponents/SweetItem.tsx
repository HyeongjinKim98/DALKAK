import { useState, useEffect } from 'react';
import './SweetItem.scss';
import Image, { StaticImageData } from 'next/image';
import surveyStore from '@/store/surveyStore';

interface ItemProps {
  id: number;
  name: string;
  description: string;
  imgSrc: StaticImageData;
  val: number;
}
export default function SweetItem({
  id,
  name,
  val,
  description,
  imgSrc,
}: ItemProps) {
  const [selected, setSelected] = useState(
    surveyStore.getState().sweetness === id,
  );
  useEffect(() => {
    const deselect = surveyStore.subscribe(() => {
      const newSelected = surveyStore.getState().sweetness === val;
      setSelected(newSelected);
    });

    return () => deselect();
  }, [name, val]);
  const setSweetness = surveyStore((state) => state.setSweetness);

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={() => setSweetness(val)}
      key={id}
      className={`sweet-item ${selected ? 'selected' : ''}`}
    >
      <Image src={imgSrc} width={80} alt="nosweet" />
      <div className="description">{description}</div>
    </div>
  );
}
