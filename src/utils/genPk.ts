function generatePk(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 52;

  let randomPk = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomPk += characters.charAt(randomIndex);
  }

  return randomPk;
}

export default generatePk;
