from sqlalchemy.orm import Session
from ..database.dataloader import DataLoader
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity


def recommend_by_prefer(m_id: int, db: Session):
  loader = DataLoader(db)
  # 후보군 칵테일 (좋아요+설문조사에서 좋아요)
  candidates = set()
  # 사용자가 좋아요 한 칵테일
  heart_cocktails = loader.load_heart_cocktails(m_id)
  # 후보군 칵테일에 좋아요한 칵테일 + 같은 군집내의 칵테일 넣기
  clustered_df = pd.read_csv("/code/app/clustered_data.csv")
  for h in heart_cocktails:
    group = clustered_df.iloc[h._data[0] - 1]['cluster_label']
    filtered_rows = clustered_df[clustered_df['cluster_label'] == group]
    for k in filtered_rows['cluster_label'].to_dict().keys():
      candidates.add(k)
  # candidates의 길이가 짧으면 설문조사에서 선택한 칵테일의 군집도 추가
  if len(candidates) < 30:
    survey_cocktails = loader.load_survey_cocktails(m_id)
    for s in survey_cocktails:
      group = clustered_df.iloc[s._data[0] - 1]['cluster_label']
      filtered_rows = clustered_df[clustered_df['cluster_label'] == group]
      for k in filtered_rows['cluster_label'].to_dict().keys():
        candidates.add(k + 1)
  df = pd.read_csv('/code/app/for_recommend.csv', index_col=0)
  if len(candidates) > 30:
    df = df[['base_spirit', 'degree', 'sugar', '오후 술', '저녁 술', '식전 술', '식후 술']]
  else:
    tmp=[]
    for cc in candidates:
      tmp.append(cc-1)
    df = df.iloc[tmp, [df.columns.get_loc('base_spirit'),
                                    df.columns.get_loc('degree'),
                                    df.columns.get_loc('sugar'),
                                    df.columns.get_loc('오후 술'),
                                    df.columns.get_loc('저녁 술'),
                                    df.columns.get_loc('식전 술'),
                                    df.columns.get_loc('식후 술')]]

  # 설문조사 결과
  survey_res = loader.load_survey_res(m_id)
  survey_res_df = pd.DataFrame({'base_spirit': [survey_res[0]._data[0]],
                                'degree': [survey_res[0]._data[1]],
                                'sugar': [survey_res[0]._data[2]],
                                'occasion_id': [survey_res[0]._data[3]]})
  return _sort_by_survey(survey_res_df, df, 20)


# 사용자 그룹별로 랭킹
# def recommend_by_ppl(m_id: int):


def recommend_by_refrigerator(m_id: int, db: Session):
  def jaccard_sim(ingredient):
    set2 = set(ingredient.split(","))
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    return intersection / union

  def diff(ingredient):
    set2 = set(ingredient.split(","))
    diffs = set2.difference(set1)
    for d in diffs:
      if d in dislike:
        return -1
      else:
        return diffs
    return diffs

  def diff_len(ingredient):
    set2 = set(ingredient.split(","))
    return len(set2.difference(set1))

  loader = DataLoader(db)
  # 싫어하는 재료
  dislike_ingredients = loader.load_dislike_ingredient(m_id)
  # 냉장고에 있는 재료
  refrigerator_ingredients = loader.load_refrigerator_ingredients(m_id)
  set1 = set()
  for r in refrigerator_ingredients:
    set1.add(r._data[0])
  dislike = set()
  for di in dislike_ingredients:
    dislike.add(di._data[0])
  df = pd.read_csv('/code/app/for_recommend.csv', index_col=0)
  df['jaccard_sim'] = df['ingredient'].apply(jaccard_sim)
  df['diff'] = df['ingredient'].apply(diff)
  # diff에 싫어하는 재료 있는 경우 row 삭제
  df = df[df['diff'] != -1]
  df['diff_len'] = df['ingredient'].apply(diff_len)

  df = df.sort_values(by='jaccard_sim', ascending=False)
  # 설문조사 결과
  survey_res = loader.load_survey_res(m_id)
  survey_res_df = pd.DataFrame({'base_spirit': [survey_res[0]._data[0]],
                                'degree': [survey_res[0]._data[1]],
                                'sugar': [survey_res[0]._data[2]],
                                'occasion_id': [survey_res[0]._data[3]]})

  df1 = df[df['diff_len'] == 0]
  df1 = df1.drop(['jaccard_sim', 'diff', 'diff_len', 'ingredient'], axis=1)
  zero = _sort_by_survey(survey_res_df, df1[:30], 8)
  df2 = df[df['diff_len'] != 0]
  df2 = df2.drop(['jaccard_sim', 'diff', 'diff_len', 'ingredient'], axis=1)
  nonzero = _sort_by_survey(survey_res_df, df2[:10], 8)
  return zero, nonzero


# 결과 이용해서 코사인 유사도 정렬
def _sort_by_survey(survey_res_df, df, max_l):
  local_survey_res_df = survey_res_df[:]
  local_survey_res_df['오후 술'] = local_survey_res_df['occasion_id'].apply(
      lambda x: 1 if x == 14 else 0)
  local_survey_res_df['식전 술'] = local_survey_res_df['occasion_id'].apply(
      lambda x: 1 if x == 4 else 0)
  local_survey_res_df['식후 술'] = local_survey_res_df['occasion_id'].apply(
      lambda x: 1 if x == 13 else 0)
  local_survey_res_df['저녁 술'] = local_survey_res_df['occasion_id'].apply(
      lambda x: 1 if x == 15 else 0)
  del local_survey_res_df['occasion_id']
  df = pd.concat([local_survey_res_df, df], axis=0)
  one_hot_encoded = df['base_spirit'].str.get_dummies(sep='|')
  df = pd.concat([df, one_hot_encoded], axis=1)
  del df['base_spirit']
  cosine_sim = cosine_similarity(df.iloc[0].values.reshape(1, -1), df.values)
  df['cosine_sim'] = cosine_sim[0]

  df = df.sort_values(by='cosine_sim', ascending=False)
  return df[1:max_l + 1].index.tolist()
