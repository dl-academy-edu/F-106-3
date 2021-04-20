const add = (a, b) => a + b;

(function () {
  const arr = [1, 2, 3, 4, 5, 6, 7];
  const s = add(1, 5);
  console.log(s);
});


(function () {
  // counterCreater()();
  const counter = counterCreater();
  const index = counter();
  // const qwe = index();
  console.log(index);
});


function counterCreater() {
  let index = 0;
  return () => {
    index += 4;
    return index;
  };
}

function summ(array) {
  let s = 0;
  for (let item of array) {
    s += item;
  }
  return s;
}

(function () {
  let arr = [
    {money: 1, home: {city: 'Тольятти'}, name: 'Тест'}, 
    {money: 2, home: {city: 'Тольятти'}, name: 'Тест'}, 
    {money: 3, home: {city: 'Тольятти'}, name: 'Тест'},
    {money: 4, home: {city: 'Тольятти'}, name: 'Тест'},
    {money: 5},
    {money: 6},
    {money: 7},
    {money: 8},
    {money: 9},
    {money: 10},
    {money: 11},
    {money: 12},
    {money: 13},
    {money: 14},
    {money: 15},
  ];

  console.log(
    arr
      .filter(item => !(item.money % 2))
      .map(item => ({money: item.money * item.money}))
      .reduce((prev, item) => prev + item.money, 0)
  );

  let arr2 = arr.map(item => item.home 
    ? `money: ${item.money}, home: ${item.home.city}, name: ${item.name}`
    : `money: ${item.money}`);
  let str = arr2.join(';\n');

  console.log(str);
});

(function() {
  let i = 1;
  const id = setInterval(() => {
    console.log(i++);
  }, 1 * 1000);
  setTimeout(() => {
    clearTimeout(id);
  }, 10 * 1000);
})();