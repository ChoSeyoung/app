/**
 * 이유식 레시피 결과물 프리뷰 컴포넌트.
 *
 * 역할:
 * - 레시피 카드와 상세 화면에서 실제 완성된 음식 느낌을 빠르게 보여준다.
 * - 사진 에셋이 없는 상태에서도 레시피마다 다른 결과물을 구분할 수 있게 한다.
 *
 * 유지보수 포인트:
 * - 레시피가 늘어나면 recipeId별 색상과 토핑 배치만 추가하고 레이아웃 구조는 유지한다.
 * - 외부 이미지 에셋에 의존하지 않고도 화면 톤이 유지되도록 플레이스홀더 완성도를 유지한다.
 */
import { StyleSheet, View } from 'react-native';

type RecipePreviewProps = {
  recipeId: string;
  size?: 'card' | 'detail';
};

type ToppingPiece = {
  left: string;
  top: string;
  width: number;
  height: number;
  rotate?: string;
  color: string;
  opacity?: number;
};

type RecipeVisual = {
  background: string;
  plate: string;
  food: string;
  drizzle?: string;
  garnish: string;
  toppings: ToppingPiece[];
};

const RECIPE_VISUALS: Record<string, RecipeVisual> = {
  ricePumpkin: {
    background: '#F9E7D5',
    plate: '#FFF8F1',
    food: '#F5C06A',
    drizzle: '#F7DDA8',
    garnish: '#E59C45',
    toppings: [
      { left: '28%', top: '33%', width: 56, height: 34, color: '#F3BD61' },
      { left: '46%', top: '37%', width: 48, height: 28, color: '#F9D892' },
      { left: '39%', top: '47%', width: 20, height: 12, color: '#E59C45', rotate: '-10deg' },
    ],
  },
  oatApple: {
    background: '#F8E5DF',
    plate: '#FFF9F6',
    food: '#E7C6A1',
    drizzle: '#F3E1CC',
    garnish: '#D7866F',
    toppings: [
      { left: '27%', top: '35%', width: 62, height: 34, color: '#E8C7A2' },
      { left: '48%', top: '38%', width: 30, height: 18, color: '#E89B7F', rotate: '-14deg' },
      { left: '39%', top: '50%', width: 18, height: 10, color: '#D7866F', rotate: '12deg' },
    ],
  },
  beefBroccoli: {
    background: '#E8E4DA',
    plate: '#FFFDF8',
    food: '#CFC0A6',
    drizzle: '#8A6A56',
    garnish: '#7EAD74',
    toppings: [
      { left: '26%', top: '36%', width: 64, height: 34, color: '#CDBA9B' },
      { left: '51%', top: '37%', width: 18, height: 18, color: '#8A6A56' },
      { left: '43%', top: '49%', width: 16, height: 16, color: '#7EAD74' },
      { left: '56%', top: '50%', width: 14, height: 14, color: '#7EAD74' },
    ],
  },
  tofuZucchini: {
    background: '#E5F0D9',
    plate: '#FCFFF8',
    food: '#E9E3D2',
    drizzle: '#BFD48E',
    garnish: '#90B46A',
    toppings: [
      { left: '28%', top: '35%', width: 60, height: 32, color: '#E8E0CF' },
      { left: '49%', top: '38%', width: 22, height: 14, color: '#C7DFA1', rotate: '-8deg' },
      { left: '39%', top: '48%', width: 16, height: 12, color: '#90B46A', rotate: '8deg' },
    ],
  },
  riceBallTofuStick: {
    background: '#F2E4D6',
    plate: '#FFF9F3',
    food: '#F8E4C3',
    drizzle: '#D7B594',
    garnish: '#8DB470',
    toppings: [
      { left: '27%', top: '40%', width: 24, height: 24, color: '#F8E8CF' },
      { left: '41%', top: '38%', width: 24, height: 24, color: '#F8E8CF' },
      { left: '56%', top: '36%', width: 18, height: 42, color: '#EAD8BE' },
      { left: '67%', top: '37%', width: 18, height: 42, color: '#EAD8BE' },
      { left: '35%', top: '33%', width: 8, height: 8, color: '#8DB470' },
      { left: '63%', top: '33%', width: 8, height: 8, color: '#8DB470' },
    ],
  },
  sweetPotatoFinger: {
    background: '#F8E8C9',
    plate: '#FFFDF7',
    food: '#F3B268',
    drizzle: '#F5D37A',
    garnish: '#D89E4E',
    toppings: [
      { left: '28%', top: '36%', width: 18, height: 48, color: '#F3B268', rotate: '-12deg' },
      { left: '46%', top: '37%', width: 18, height: 48, color: '#F3B268', rotate: '6deg' },
      { left: '61%', top: '38%', width: 22, height: 40, color: '#F5D37A', rotate: '12deg' },
    ],
  },
};

export function RecipePreview({ recipeId, size = 'card' }: RecipePreviewProps) {
  const visual = RECIPE_VISUALS[recipeId] ?? RECIPE_VISUALS.ricePumpkin;
  const isDetail = size === 'detail';

  return (
    <View style={[styles.wrap, { backgroundColor: visual.background }, isDetail ? styles.wrapDetail : styles.wrapCard]}>
      <>
      <View style={[styles.shadowBlob, { backgroundColor: visual.garnish }]} />
      <View style={[styles.plate, { backgroundColor: visual.plate }]}>
        <View style={[styles.foodBase, { backgroundColor: visual.food }]}>
          {visual.drizzle ? <View style={[styles.drizzle, { backgroundColor: visual.drizzle }]} /> : null}
          {visual.toppings.map((piece, index) => (
            <View
              key={`${recipeId}-${index}`}
              style={[
                styles.topping,
                {
                  left: piece.left,
                  top: piece.top,
                  width: piece.width,
                  height: piece.height,
                  backgroundColor: piece.color,
                  opacity: piece.opacity ?? 1,
                  transform: piece.rotate ? [{ rotate: piece.rotate }] : undefined,
                },
              ]}
            />
          ))}
        </View>
      </View>
      <View style={[styles.sparkle, styles.sparkleLeft, { backgroundColor: `${visual.garnish}55` }]} />
      <View style={[styles.sparkle, styles.sparkleRight, { backgroundColor: `${visual.garnish}66` }]} />
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapCard: {
    aspectRatio: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  wrapDetail: {
    aspectRatio: 1.2,
    borderRadius: 24,
  },
  shadowBlob: {
    position: 'absolute',
    bottom: '22%',
    width: '58%',
    height: '10%',
    borderRadius: 999,
    opacity: 0.18,
  },
  plate: {
    width: '76%',
    aspectRatio: 1.08,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D7C2AE',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  foodBase: {
    width: '74%',
    height: '52%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  drizzle: {
    position: 'absolute',
    top: '18%',
    left: '22%',
    width: '48%',
    height: '18%',
    borderRadius: 999,
    opacity: 0.55,
  },
  topping: {
    position: 'absolute',
    borderRadius: 999,
  },
  sparkle: {
    position: 'absolute',
    borderRadius: 999,
  },
  sparkleLeft: {
    width: 14,
    height: 14,
    left: '16%',
    top: '20%',
  },
  sparkleRight: {
    width: 10,
    height: 10,
    right: '18%',
    top: '30%',
  },
});
