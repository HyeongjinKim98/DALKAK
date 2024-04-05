// 'use client';

// import { ChangeEvent, useState, useEffect } from 'react';

// import styles from './CustomCocktailAddIngredient.module.scss';

// interface Unit {
//   id: number;
//   name: string;
// }

// interface Origin {
//   id: number;
//   name: string;
//   image: string;
//   category_id: number;
//   amount: number;
//   unit: Unit;
// }

// interface Props {
//   origin: Origin[];
// }

// export default function CustomCocktailAddIngredient({ origin }: Props) {
//   const [tempList, setTempList] = useState<Origin[]>([]);
//   // const [amount, setAmount] = useState(origin.ingredient_amount)
//   const [inputValues, setInputValues] = useState<string[]>([]);
//   // const [tempValues, setTempValues] = useState<string[]>([]);
//   const [inputUnitValues, setInputUnitValues] = useState<string[]>([]);

//   useEffect(() => {
//     setTempList(origin);
//     setInputValues(origin.map((item) => String(item.amount)));
//     // setTempValues(inputValues);
//     setInputUnitValues(origin.map((item) => String(item.unit.name)));
//   }, [origin]);

//   const removeItem = (id: number) => {
//     setTempList((prevList) => prevList.filter((data) => data.id !== id));
//   };

//   const handleInputChangeTest = (
//     e: ChangeEvent<HTMLInputElement>,
//     id: number,
//     index: number[],
//   ) => {
//     const tempNum = e.target.value;
//     const indexToUpdate = index[0];

//     setInputValues((prevInputValues) => {
//       const newInputValues = [...prevInputValues];
//       newInputValues[indexToUpdate] = tempNum;
//       return newInputValues;
//     });
//   };

//   const handleUnitInputChange = (
//     e: ChangeEvent<HTMLSelectElement>,
//     id: number,
//     index: number[],
//   ) => {
//     const indexToUpdate = index[0];
//     const unitValue = e.target.value;
//     setInputUnitValues((prevUnitValues) => {
//       const updatedUnitValues = [...prevUnitValues];
//       updatedUnitValues[indexToUpdate] = unitValue;
//       return updatedUnitValues;
//     });
//   };

//   return (
//     <div>
//       <div className={styles.title}>재료</div>

//       <div className={styles.scrollable}>
//         <div className={styles.add}>
//           {tempList.map((data, index) => (
//             // eslint-disable-next-line react/no-array-index-key
//             <div key={index}>
//               <div className={styles['grid-container']}>
//                 <div>{data.name}</div>
//                 <div />
//                 <div>
//                   <input
//                     type="text"
//                     pattern="[0-9]+"
//                     className={styles['amount-input']}
//                     value={inputValues[index]}
//                     // value={tempValues[index]}
//                     // onChange={(e) => handleInputChange(e, data.id)}
//                     maxLength={4}
//                     onChange={(e) => handleInputChangeTest(e, data.id, [index])}
//                   />
//                 </div>
//                 <div>
//                   <select
//                     className={styles['unit-input']}
//                     value={inputUnitValues[index]}
//                     onChange={
//                       (e) => handleUnitInputChange(e, data.id, [index])
//                       // eslint-disable-next-line react/jsx-curly-newline
//                     }
//                   >
//                     <option>개</option>
//                     <option>웨지</option>
//                     <option>슬라이스</option>
//                     <option>꼬집</option>
//                     <option>조각</option>
//                     <option>ml</option>
//                     <option>스쿱</option>
//                     <option>방울</option>
//                     <option>그램</option>
//                     <option>잎</option>
//                     <option>none</option>
//                   </select>
//                 </div>
//                 <div />
//                 <div>
//                   <button
//                     type="button"
//                     className={styles['delete-button']}
//                     onClick={() => removeItem(data.id)}
//                   >
//                     ✕
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <input
//         className={styles['ingredient-input-style']}
//         placeholder="추가할 재료를 검색해보세요!"
//       />
//     </div>
//   );
// }
