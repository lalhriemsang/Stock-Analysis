const chartsApi = "https://stocks3.onrender.com/api/stocks/getstocksdata";

const stocksStatsApi =
  "https://stocks3.onrender.com/api/stocks/getstockstatsdata";

const stocksDetailApi =
  "https://stocks3.onrender.com/api/stocks/getstocksprofiledata";

function setColor(profit) {
  if (profit > 0) return "green";
  else return "red";
}

async function displayStock(
  stockName,
  dur = "1mo",
  currStockBookVal,
  currStockProfit
) {
  let response, data;

  response = await fetch(chartsApi);
  data = await response.json();

  const stockVals = data.stocksData[0][stockName][dur];
  // console.log(stockVals);

  let timestamps = stockVals["timeStamp"];
  let prices = stockVals["value"];

  for (let i in timestamps) {
    timestamps[i] = new Date(timestamps[i] * 1000).toLocaleDateString();
  }

  const dates = timestamps.map((timestamp) => new Date(timestamp));
  //   console.log(dates);
  // console.log(prices);

  const stockData = {
    labels: dates,
    datasets: [
      {
        label: "Stock Price",
        data: prices,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        pointBackgroundColor: [], // Array to store background colors of each point
        pointBorderColor: [],
      },
    ],
  };

  const pointBackgroundColors = [];
  const pointBorderColors = [];

  // Set default colors for all points
  for (let i = 0; i < prices.length; i++) {
    pointBackgroundColors.push("rgb(75, 192, 192)"); // Default color
    pointBorderColors.push("rgb(75, 192, 192)"); // Default color
  }

  // Find indices of the lowest and highest points
  const minIndex = prices.indexOf(Math.min(...prices));
  const maxIndex = prices.indexOf(Math.max(...prices));

  // Set different colors for lowest and highest points
  pointBackgroundColors[minIndex] = "red";
  pointBorderColors[minIndex] = "red";
  pointBackgroundColors[maxIndex] = "green";
  pointBorderColors[maxIndex] = "green";

  // Update the dataset with the new point colors
  stockData.datasets[0].pointBackgroundColor = pointBackgroundColors;
  stockData.datasets[0].pointBorderColor = pointBorderColors;

  console.log(dates[minIndex], prices[minIndex]);

  // Get the canvas element
  const ctx = document.getElementById("chart").getContext("2d");

  // Destroy existing chart if it exists
  if (window.stockChart) {
    window.stockChart.destroy();
  }

  // Create the chart
  window.stockChart = new Chart(ctx, {
    type: "line",
    data: stockData,
    options: {
      scales: {
        x: {
          type: "time",
          time: {
            unit: "month", // Adjust as needed
          },
        },
        y: {
          beginAtZero: false, // Adjust as needed
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: function (tooltipItems) {
              // Display the timestamp on the x-axis
              const timestamp = tooltipItems[0].parsed.x;
              return new Date(timestamp).toLocaleDateString();
            },
            label: function (tooltipItem) {
              // Display the name and price of the stock at that date
              const dataset = tooltipItem.dataset;
              const index = tooltipItem.dataIndex;
              const label = stockName;
              const value = dataset.data[index];
              return `${label}: ${value}`;
            },
          },
        },
      },
    },
  });

  document.getElementById("highest").textContent =
    "$" + prices[maxIndex].toFixed(3);
  document.getElementById("lowest").textContent =
    "$" + prices[minIndex].toFixed(3);

  const detailsEl = document.getElementById("details");
  detailsEl.textContent = "";
  response = await fetch(stocksDetailApi);
  data = await response.json();

  console.log(data.stocksProfileData[0][stockName].summary);
  const lowhighValEl = document.createElement("p");
  lowhighValEl.classList.add("flex");
  lowhighValEl.innerHTML = `<h2>${stockName}</h2> <h2 class="green">$${currStockBookVal}</h2> <h2 class="red">${currStockProfit}%</h2>`;
  const summaryEl = document.createElement("p");
  summaryEl.textContent = data.stocksProfileData[0][stockName].summary;

  detailsEl.appendChild(lowhighValEl);
  detailsEl.appendChild(summaryEl);
}

export { setColor, displayStock };
