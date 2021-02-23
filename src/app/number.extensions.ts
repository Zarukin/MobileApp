// number.extensions.ts

interface Number {
  toMMSS(): string;
}

Number.prototype.toMMSS = function(): string {
  const minute = Math.floor(this / 60);
  let second: any = this % 60;
  if (second < 10) {
    second = "0" + second;
  }
  return minute + ":" + second;
};
