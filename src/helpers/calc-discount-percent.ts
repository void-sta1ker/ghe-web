export default function calcDiscountPc(price: number, discount: number) {
  const reductionPc = Math.round((discount * 100) / price);
  return 100 - reductionPc;
}
