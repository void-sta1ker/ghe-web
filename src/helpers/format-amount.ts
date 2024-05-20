/**
 * Display number values fetched from some api for users in a friendly format
 * @param {Number} num number to format
 * @param {String} separator what character to use between numbers
 * @returns {String} returns formatted number in string
 * @example 9457 -> '9457' -> ['9','4','5','7'] -> ['9',' ','4','5','7'] -> '9 457'
 */
export default function formatAmount(num: number, separator = " "): string {
  function putWhitespace(
    acc: string[],
    curr: string,
    currIdx: number,
  ): string[] {
    const numLength = num.toString().length;
    const subLength = numLength - currIdx;

    if (subLength % 3 === 0 && subLength !== numLength) {
      return [separator, curr, ...acc];
    }

    return [curr, ...acc];
  }

  return num.toString().split("").reduceRight(putWhitespace, []).join("");
}
