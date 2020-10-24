const $siteList = $(".siteList");
const $lastLi = $siteList.find("li.last");
const x = localStorage.getItem("x");
const xObject = JSON.parse(x);
const dataMap = xObject || [
  { logo: "A", url: "https://www.acfun.cn" },
  { logo: "B", url: "https://www.bilibili.com" },
];
const simplifyUrl = (url) => {
  const re = /^(http(s)?:\/\/)?(www\.)?([-a-zA-Z0-9\.]*)/;
  let result = re.exec(url);
  return result[4]; // 提取域名，除www以外的 host，即 ([-a-zA-Z0-9\.]*)
};

const saveData = () => {
  /* 保存数据 */
  const dataStr = JSON.stringify(dataMap);
  localStorage.setItem("x", dataStr);
};

const render = () => {
  /* 重新加载书签 */
  $siteList.find("li:not(.last)").remove();
  dataMap.forEach((node, index) => {
    const $li = $(`
        <li>
          <div class="site">
            <div class="logo">${node.logo}</div>
            <div class="link">${simplifyUrl(node.url)}</div>
            <div class="close">
              <svg class="icon">
                <use xlink:href="#icon-remove"></use>
              </svg>
            </div>
          </div>
        </li>
      `).insertBefore($lastLi);
    $li.on("click", () => {
      window.open(node.url);
    });
    $li.on("click", ".close", (e) => {
      e.stopPropagation(); // 阻止冒泡
      dataMap.splice(index, 1);
      render();
    });
  });
  // 每次重加载都保存一下数据
  saveData();
};
// 初始化加载
render();
// 添加网站事件
$(".addButton").on("click", () => {
  let url = window.prompt("请输入要添加的网址：");
  if (url.indexOf("http") !== 0) {
    url = "https://" + url;
  }
  console.log(url);
  dataMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    url: url,
  });
  render();
});

$(document).on("keypress", (e) => {
  const { key } = e;
  for (const data of dataMap) {
    if (data.logo.toLowerCase() === key) {
      console.log(`quick open: ${data.url}`);
      window.open(data.url);
    }
  }
});
// 搜索栏阻止冒泡
const $searchForm = $(".searchForm");
$searchForm.on("keypress", (e) => {
  e.stopPropagation()
})