import { setColor, displayStock } from "./functions.js";

const chartsApi = "https://stocks3.onrender.com/api/stocks/getstocksdata";

const stocksStatsApi =
  "https://stocks3.onrender.com/api/stocks/getstockstatsdata";

const stocksDetailApi =
  "https://stocks3.onrender.com/api/stocks/getstocksprofiledata";

const stocks = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "PYPL",
  "TSLA",
  "JPM",
  "NVDA",
  "NFLX",
  "DIS",
];

window.currStock = "";
window.currStockBookVal = 0;
window.currStockProfit = 0;

async function fetchStocksData() {
  let response, data;

  response = await fetch(stocksStatsApi);
  data = await response.json();

  const stocksStats = data.stocksStatsData[0];

  const stocksListEl = document.getElementById("stocks");

  for (const stock of stocks) {
    const stockStatsEl = document.createElement("div");
    stockStatsEl.classList.add("stockStats");

    const stockBtn = document.createElement("button");
    stockBtn.classList.add("stockBtn");
    stockBtn.textContent = stock;
    stockBtn.addEventListener("click", function () {
      currStock = stock;
      currStockBookVal = stocksStats[stock].bookValue;
      currStockProfit = stocksStats[stock].profit;
      displayStock(stock, "1mo", currStockBookVal, currStockProfit);
    });

    const bookValEl = document.createElement("span");
    bookValEl.textContent = "$" + stocksStats[stock].bookValue;
    const profitEl = document.createElement("span");
    profitEl.textContent = stocksStats[stock].profit + "%";

    if (setColor(stocksStats[stock].profit) == "green")
      profitEl.classList.add("green");
    else profitEl.classList.add("red");

    stockStatsEl.appendChild(stockBtn);
    stockStatsEl.appendChild(bookValEl);
    stockStatsEl.appendChild(profitEl);

    stocksListEl.appendChild(stockStatsEl);
  }
}

fetchStocksData();

const oneMonthBtn = document.getElementById("1mo");
const threeMonthsBtn = document.getElementById("3mo");
const oneyearBtn = document.getElementById("1y");
const fiveyearsBtn = document.getElementById("5y");

oneMonthBtn.addEventListener("click", function () {
  displayStock(currStock, "1mo", currStockBookVal, currStockProfit);
});
threeMonthsBtn.addEventListener("click", function () {
  displayStock(currStock, "3mo", currStockBookVal, currStockProfit);
});
oneyearBtn.addEventListener("click", function () {
  displayStock(currStock, "1y", currStockBookVal, currStockProfit);
});
fiveyearsBtn.addEventListener("click", function () {
  displayStock(currStock, "5y", currStockBookVal, currStockProfit);
});
